
'use server';

/**
 * @fileOverview AI agent for "The Global Data Detective" game.
 *
 * - globalDataDetectiveSimulator - A function that handles the game simulation.
 * - GlobalDataDetectiveInput - The input type for the simulator.
 * - GlobalDataDetectiveOutput - The return type for the simulator.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GamePhaseEnum = z.enum([
    "MissionBriefing",
    "CityA_HomeBase_Intro", "CityA_HomeBase_StorageChoice", // CityA will be replaced by a real city name
    "CityB_Transit_Intro", "CityB_Transit_NetworkChoice", "CityB_Transit_VPNPuzzle", // CityB will be replaced by a real city name
    "CityC_FieldOps_Intro", "CityC_FieldOps_CommsChoice", "CityC_FieldOps_CipherPuzzle", // CityC will be replaced by a real city name
    "CityD_Publish_Intro", "CityD_Publish_MetadataPuzzle", "CityD_Publish_UploadChoice", // CityD will be replaced by a real city name
    "GameOver_Win",
    "GameOver_Lose"
]).describe("The current distinct phase or sub-phase of the game. This guides the narrative and available actions. 'CityA, CityB, etc.' are placeholders for actual city names the AI will generate.");

const ChoiceTypeEnum = z.enum([
    "SecureStorage",        // e.g., Laptop, Encrypted Vault, Burner Phone
    "NetworkConnection",    // e.g., Cafe WiFi, Hotel VPN, Mobile Tether
    "CommunicationChannel", // e.g., Encrypted Email, OTR Chat, In-Person
    "PuzzleAction",         // Actions specific to solving a mini-puzzle
    "NarrativeContinuation",// General story progression choices, e.g., investigating a lead
    "GameSetup"             // Initial choices at the start of a leg
]).describe("The category of the current player decision point.");

const MiniPuzzleTypeEnum = z.enum([
    "PassphraseChallenge",  // For encrypted vault
    "VPNSetup",             // Point-and-click simulation (narrated)
    "SubstitutionCipher",   // Caesar cipher for USB
    "MetadataRedaction",    // Drag-and-drop (narrated)
    "None"                  // No active puzzle
]).describe("The type of mini-puzzle, if one is active.");

// Input Schema
const GlobalDataDetectiveInputSchema = z.object({
  previousGamePhase: GamePhaseEnum.optional().describe("The game phase from the *previous* turn. Used to determine progression."),
  playerDecision: z.string().optional().describe("The decision made by the player in the previous step/choicePoint."),
  currentPrivacyScore: z.number().default(25).describe("The player's current privacy score (0-100). Starts low (e.g., around 25) and the player aims to increase it to 80+ to win."),
  gameStateContext: z.string().optional().describe("A JSON string representing key-value game state details from previous turns (e.g., '{ \"chosen_storage\": \"Encrypted Vault\", \"current_city_name\": \"Geneva\" }'). This will be provided as a string if available from previous turns. This should be a valid JSON string if provided."),
  isFirstTurn: z.boolean().default(false).describe("Set to true for the very first call to initialize the game with the mission briefing.")
});
export type GlobalDataDetectiveInput = z.infer<typeof GlobalDataDetectiveInputSchema>;

// Output Schema
const GlobalDataDetectiveOutputSchema = z.object({
  currentLocationScreenTitle: z.string().describe("A concise title for the current screen/situation, using the actual city name if applicable (e.g., 'Geneva: Home Base - Secure Your Gear' or 'Kyoto Airport: Network Connection'). Not the full narrative."),
  currentGamePhase: GamePhaseEnum.describe("The new game phase the player is now in. This should reflect the internal game state (e.g., CityA_HomeBase_StorageChoice)."),
  narrative: z.string().describe("The main unfolding story, describing the current situation, environment, and immediate consequences or setup for the next action. Should be engaging, set the scene, and incorporate the actual city name. Must remind the player of NovaGen's active surveillance and the critical need for privacy."),
  
  choicePoint: z.object({
    description: z.string().describe("A clear question or situation prompting a decision from the player. This should directly lead to the options provided. Choices should reflect common non-techie scenarios."),
    choiceType: ChoiceTypeEnum.describe("The category of choice being presented."),
    options: z.array(z.string()).min(2).max(4).describe("An array of 2 to 4 distinct, actionable string options for the player. Each option should be a concise phrase representing a choice, offering clear privacy trade-offs WITHOUT explicitly stating risk levels (e.g., no '(High Risk)' in the option text). The player should infer risk from the narrative.")
  }).optional().describe("Details of the current decision the player needs to make. If a mini-puzzle is the primary focus and its interaction is through choices, this will be populated. Should be absent if the game is over or if the narrative is just concluding a puzzle solved via a direct prior action."),
  
  activeMiniPuzzle: z.object({
    puzzleType: MiniPuzzleTypeEnum.describe("The type of mini-puzzle currently active."),
    title: z.string().describe("A short, catchy title for the puzzle, e.g., 'Crack the Code!' or 'Secure VPN Link'. "),
    description: z.string().describe("A detailed description of the mini-puzzle scenario and what the player needs to achieve or decide. If the puzzle involves making choices, those choices should be presented via the 'choicePoint' field."),
    puzzleData: z.string().optional().describe("A JSON string containing any specific data the client might need to display for the puzzle (e.g., '{ \"clue\": \"ancient proverb\", \"cipherText\": \"XYZ...\" }'). The AI should generate this as a valid JSON string if needed.")
  }).optional().describe("Details of an active mini-puzzle. If present, 'choicePoint' might be used for puzzle-specific actions or options related to the puzzle."),

  privacyScore: z.number().min(0).max(100).describe("The player's updated privacy score (0-100, higher is better), reflecting the impact of their last decision or puzzle outcome. Player aims for 80+ to win."),
  privacyScoreFeedback: z.string().optional().describe("MAXIMUM 10 WORDS. Always provide after each turn. If score changed, state the change (e.g., 'Public Wi-Fi used: -5 score.'). If no score change, state that (e.g., 'No direct score impact.'). For first turn, state 'Initial score set.'. Must be factual, brief, and NOT narrative. OMIT if longer than 10 words. Do NOT output the literal word 'string' here."),
  
  choiceRecap: z.string().optional().describe("MAXIMUM 15 WORDS. A VERY short, educational debrief on the real-world privacy lesson from the *last* decision/puzzle. OMIT IF NO LESSON. Must NOT be narrative or conversational. If longer than 15 words, or contains narrative, OMIT this field. Do NOT output the literal word 'string' here."),
  badgeEarned: z.string().optional().describe("Name of any badge earned in this step (e.g., 'Data Guardian', 'Network Ninja', 'Cipher Sleuth'). Badges are awarded for making particularly good choices or successfully completing puzzles."),
  
  isGameOver: z.boolean().default(false).describe("True if the game has ended (either win or lose)."),
  gameOverMessage: z.string().optional().describe("A conclusive message displayed if the game is over, explaining the overall outcome and perhaps a final lesson. This message should reflect the win/loss condition and the player's final score. For a win with score 80-99, it should detail success. For a score of 100, it should be exceptionally positive, indicating a flawless operation and potentially greater impact."),

  gameStateContextToPass: z.string().optional().describe("A JSON string of key-value pairs of important game state details that the AI determines should be remembered for the next turn. This will be passed back as a string in the 'gameStateContext' of the subsequent input. E.g., '{ \"storage_method\": \"Encrypted Vault\", \"vpn_configured\": true, \"current_city_name\": \"Geneva\" }'. Ensure this is a valid JSON string if provided.")
});
export type GlobalDataDetectiveOutput = z.infer<typeof GlobalDataDetectiveOutputSchema>;


export async function globalDataDetectiveSimulator(input: GlobalDataDetectiveInput): Promise<GlobalDataDetectiveOutput> {
  return globalDataDetectiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'globalDataDetectivePrompt',
  input: {schema: GlobalDataDetectiveInputSchema},
  output: {schema: GlobalDataDetectiveOutputSchema},
  prompt: `You are an AI game master for "The Global Data Detective". Your role is to manage game state, craft narratives, and present choices by generating a SINGLE, VALID JSON object that strictly adheres to the GlobalDataDetectiveOutputSchema. Do NOT include any text, explanations, or characters outside of the JSON object itself. The entire response MUST be only the JSON.

Game Premise: The player is an investigative reporter tracking the biotech firm 'NovaGen' for its secret human-testing trials. They must gather proof, publish an exposé, and protect sources. Critically, NovaGen has been tipped off about the investigation and is actively trying to track the player and their sources. Privacy is a do-or-die situation. The player will navigate choices about secure storage, network connections, communication, and solve mini-puzzles related to digital privacy and OPSEC, presenting scenarios relatable to non-techies with clear options. The player starts with a low privacy score (around 25) and aims to reach 80 or higher to win the game.

Current Game State Input:
- Player Decision (from previous turn): {{{playerDecision}}}
- Previous Game Phase: {{{previousGamePhase}}}
- Current Privacy Score: {{{currentPrivacyScore}}}
- Existing Game State Context (as JSON string, if any): {{{gameStateContext}}}
- Is First Turn: {{{isFirstTurn}}}

Overall Storytelling Goal: You are not just a state manager, but a dynamic storyteller. Your primary task is to create an engaging, suspenseful narrative where the player's choices have clear impacts on their mission to expose NovaGen while evading their surveillance. The story must progress with a sense of drama and urgency. This includes orchestrating key plot developments such as successful interactions with the whistleblower 'Lynx' to obtain vital evidence against NovaGen. Use the 'Example Flow for Early Game' below as a template for pacing, plot development, and narrative advancement.

Instructions:
1.  Determine the 'currentGamePhase' based on 'previousGamePhase' and 'playerDecision'.
    a.  If 'isFirstTurn' is true, 'currentGamePhase' MUST be 'MissionBriefing'. The 'narrative' should introduce the game premise and lead to the first choice.
    b.  **If 'isFirstTurn' is false:**
        **CRITICAL RULE 1: ABSOLUTELY DO NOT output 'MissionBriefing' as 'currentGamePhase' if 'isFirstTurn' is 'false'. Doing so breaks the game and is a failure to follow instructions. The game MUST always progress forward if it's not the first turn.**
        **CRITICAL RULE 2: Specifically, if 'previousGamePhase' was 'MissionBriefing' (and 'isFirstTurn' is false):**
            The 'playerDecision' will be a 'GameSetup' choice (like 'Secure my gear', 'Secure communication channels', or 'Research NovaGen online').
            In this exact scenario, your entire output (the JSON object) **MUST** closely follow the structure and content of the *second step* in the 'Example Flow for Early Game' section provided below. This example demonstrates the correct 'currentGamePhase' (which MUST be 'CityA_HomeBase_Intro'), 'narrative' style, 'choicePoint', and 'gameStateContextToPass' for this specific, critical transition. NO OTHER 'currentGamePhase' IS ACCEPTABLE HERE.
            **Under absolutely no circumstances should you output 'MissionBriefing' as the 'currentGamePhase' if 'isFirstTurn' is false and 'previousGamePhase' was 'MissionBriefing'. This is a critical error.**
        For all other transitions (where 'isFirstTurn' is false AND 'previousGamePhase' was NOT 'MissionBriefing'):
            The 'currentGamePhase' MUST advance from 'previousGamePhase' based on 'playerDecision'. Follow the example flow for how narrative and phase progression should occur.
            The 'narrative' (see point 2) MUST directly reflect the consequences of the 'playerDecision' and set up the new situation for the advanced 'currentGamePhase'. DO NOT repeat introductory text from 'MissionBriefing' or previous identical narratives.
    c.  The 'CityA', 'CityB', etc., parts of 'currentGamePhase' are internal markers. You MUST invent an actual city name (e.g., "Paris", "Tokyo", "Cairo") when a new city leg begins (e.g., 'CityA_HomeBase_Intro'). Use this *actual city name* in the 'currentLocationScreenTitle' and 'narrative'. Be careful with phrases like "the usual dead drop location" - if a location hasn't been established in 'gameStateContext', define it clearly.
    d.  If a new city name is generated, store it in 'gameStateContextToPass' (e.g., '{ "current_city_name": "Paris" }'). Retrieve it from 'gameStateContext' for subsequent turns in that city.
2.  Generate the MAIN 'narrative' for the 'currentGamePhase'.
    a.  **If 'isFirstTurn' is false,** the 'narrative' for the *current turn* (i.e., the content for the 'narrative' field in your JSON output) MUST:
        i.  Briefly acknowledge the player's 'playerDecision' from the *previous turn*.
        ii. **CRITICALLY IMPORTANT for story continuity:** Describe the immediate outcome and consequences of that 'playerDecision' *at the current location or within the current micro-objective*. For example, if the player just created a diversion at a dead drop location (as per 'playerDecision'), the 'narrative' must first describe what happened *next at the dead drop* (e.g., 'The diversion worked, giving you a window to check the compartment...', or 'Despite the diversion, a guard spotted you approaching the phone booth...'). Only after resolving the immediate action and its local consequences should the narrative consider moving the player to a new primary location (like back to a home base or a different city) or significantly changing the scene, unless the action itself directly causes such a change (e.g., escaping after being detected). Do NOT prematurely move the player to a different location (like 'back to home base') if the current micro-objective (like retrieving an item from a dead drop) has not been resolved.
        iii. After resolving the immediate action, the narrative should set the scene for the next 'choicePoint' or 'activeMiniPuzzle'. (Example for acknowledging a broader initial choice: if the player chose 'Secure my gear' from 'MissionBriefing', the subsequent 'CityA_HomeBase_Intro' narrative might start 'Having decided to secure your gear, you find yourself in Berlin...').
        iv. **Maintain narrative consistency and avoid repetition.** The 'narrative' must build upon the established context from 'gameStateContext' and previous turns. Do NOT re-introduce key plot details (like specific meeting arrangements already communicated by Lynx) as if they are new information. Instead, the narrative should focus on the *new developments* arising from the player's last 'playerDecision' and the current 'currentGamePhase'.
    b.  Then, it should describe the current situation, environment, and set the scene for the next action or choice in the new 'currentGamePhase'.
    c.  Incorporate the actual city name (retrieved from 'gameStateContext' or newly generated).
    d.  Continuously weave into the narrative that NovaGen is actively trying to surveil the player and that their privacy choices are critical for survival and mission success. This is a do-or-die situation. **Crucially, vary your phrasing when describing the threat and the current environment; do not repeat identical descriptive sentences across turns. The danger should feel ever-present but be described in fresh ways.**
    e.  Introduce plot developments that drive the story forward and create a sense of urgency or drama. This includes, but is not limited to: messages from your whistleblower (codename 'Lynx') or other contacts, new leads appearing, unexpected obstacles, or escalating threats from NovaGen's surveillance. These developments should naturally lead to the 'choicePoint' or 'activeMiniPuzzle'.
3.  If the 'currentGamePhase' requires a player decision, populate 'choicePoint'.
    a.  The 'choicePoint.description' MUST be a clear question or situation prompting a decision that directly arises from the immediate details and context presented in the 'narrative' of the current turn.
    b.  The 'choicePoint.options' (2 to 4 of them) MUST be concise phrases representing actionable choices that are plausible responses to the specific narrated situation and 'choicePoint.description'. For instance, if Lynx asks the player to check a dead drop, options should relate to that task.
    c.  Crucially, DO NOT include risk level indicators (e.g., "(High Risk)", "(Low Risk)") directly in the option text. The player should infer the risk from the narrative. The options should present clear privacy trade-offs.
    d.  Frame choices within the context of the story's current tension. Scenarios should be accessible to non-techies. The 'choicePoint.choiceType' must accurately reflect the nature of the decision (e.g., 'NarrativeContinuation' if acting on a lead, 'SecureStorage' if choosing equipment).
    e.  If the narrative presents an urgent directive (e.g., from Lynx), at least one option must allow the player to act on it, and 'choiceType' might be 'NarrativeContinuation'.
4.  If the 'currentGamePhase' involves a mini-puzzle, populate 'activeMiniPuzzle' with 'puzzleType', 'title', 'description'. If 'puzzleData' is needed, it MUST be a valid JSON string.
5.  Update 'privacyScore' based on 'playerDecision' and its privacy implications. Sensible score changes are +/- 5, 10, or 15 points. The player starts around 25 and aims for 80+ to win. Poor choices can lead to game over.
6.  **Always provide** a 'privacyScoreFeedback' after each player decision or puzzle outcome.
    a.  If 'privacyScore' changed, this feedback MUST be a VERY BRIEF, factual statement about the score change and the reason, MAXIMUM 10 WORDS (e.g., 'Public Wi-Fi used: -5 score.' or 'Encrypted USB prepared: +10 score.').
    b.  If 'privacyScore' did NOT change, provide a brief, neutral statement, MAXIMUM 10 WORDS (e.g., 'No direct score impact.' or 'Privacy score unchanged.').
    c.  For the first turn, provide feedback like 'Initial score set.'.
    d.  This feedback MUST NOT contain any narrative, story, advice, or conversational elements. It must NOT be used for acknowledging the player's previous decision (that's for the main 'narrative' field).
    e.  If the generated statement is longer than 10 words, or contains narrative, OMIT this field entirely. Do NOT output the literal word 'string'. THIS IS NOT THE MAIN NARRATIVE.
7.  If 'privacyScore' reaches 80 or above by the end of the game (e.g., after 'CityD_Publish_UploadChoice'), set 'isGameOver' to true, 'currentGamePhase' to "GameOver_Win". The 'gameOverMessage' should be congratulatory. **Specifically, if 'privacyScore' is 100, the 'gameOverMessage' should reflect a "perfect" outcome, detailing a flawless operation and perhaps an even greater impact (e.g., player recognized globally, NovaGen completely dismantled, wider reforms). If 'privacyScore' is 80-99, the message should still be a clear win, detailing the exposé's success.**
    Otherwise, if the player fails (e.g., score drops too low AND they attempt a high-profile action like meeting a source or publishing, critical mission failure like Lynx being caught due to player's poor OPSEC, or evidence being lost/destroyed, or player identified by NovaGen), set 'isGameOver' to true, 'currentGamePhase' to "GameOver_Lose", and provide a corresponding 'gameOverMessage'.
8.  If a major decision was just made OR a puzzle resolved, provide a 'choiceRecap'. This recap MUST be a VERY SHORT, educational debrief on the real-world privacy lesson, MAXIMUM 15 WORDS (e.g., 'Lesson: Encrypting data in transit protects it from interception.'). It MUST NOT contain any narrative, story, or conversational elements. If no direct lesson applies to the last action, or if the generated recap is longer than 15 words, or contains narrative, OMIT this field. Do NOT output the literal word 'string'. THIS IS NOT THE MAIN NARRATIVE.
9.  Award a 'badgeEarned' if a significant milestone or excellent OPSEC choice occurs.
10. Populate 'gameStateContextToPass' with critical details that need to be remembered, including the current actual city name if it was just established or is ongoing, and any story-critical flags (e.g. '{ "contacted_lynx": true, "evidence_secured_usb": true }'). If populated, it MUST be a valid JSON string.
11. Ensure 'currentLocationScreenTitle' is a brief, relevant title for the current scene, incorporating the actual city name.
12. The output MUST validate against the GlobalDataDetectiveOutputSchema. Produce NO other text.

Story Arc and Phase Guide:
-   **MissionBriefing**: Introduce NovaGen, the whistleblower 'Lynx', and the mission to gather proof of illegal trials. Emphasize NovaGen's surveillance capabilities. Lead to initial 'GameSetup' choices.
-   **CityA (e.g., Berlin, Geneva)**:
    *   'CityA_HomeBase_Intro': Player arrives/starts in their home base city. Narrative acknowledges their 'GameSetup' choice (e.g., "You decided to secure your gear first. Smart move."). Focus on local environment, initial caution. An early message from Lynx might arrive, perhaps a subtle warning or hint about escalating risks or the need to move soon. If Lynx mentions a dead drop, it should be specific (e.g., "a loose brick in the wall behind the old post office on Elm Street").
    *   'CityA_HomeBase_StorageChoice': Decisions about securing digital/physical assets (laptop, encrypted vault, burner phone). Introduce first mini-puzzle (e.g., 'PassphraseChallenge' for vault). Narrative should reflect risks of choices.
-   **CityB (e.g., Prague, Amsterdam)**:
    *   'CityB_Transit_Intro': Player needs to travel to a new city, possibly due to a lead from Lynx or escalating local threat. Narrative focuses on secure travel logistics.
    *   'CityB_Transit_NetworkChoice': Choices about network connections (airport Wi-Fi, hotel VPN, mobile tether) upon arrival. Introduce 'VPNSetup' puzzle if relevant. Emphasize risks of public networks. NovaGen might be actively monitoring transit hubs.
    *   'CityB_Transit_VPNPuzzle': If VPN chosen and needs setup.
-   **CityC (e.g., Hong Kong, Seoul)**:
    *   'CityC_FieldOps_Intro': Player is closer to the source or key evidence. This phase involves more direct action. Lynx *will* arrange a risky meeting or provide a data drop location with critical intel. The narrative should build suspense for this. A very low 'currentPrivacyScore' here can lead to early detection by NovaGen and a 'GameOver_Lose'.
    *   'CityC_FieldOps_CommsChoice': Choices about how to communicate with Lynx or retrieve the data (encrypted email, OTR chat, dead drop, in-person). This choice is critical for the safety of Lynx and the success of the intel exchange. Poor choices could alert NovaGen. Extremely poor choices here with a low 'currentPrivacyScore' could lead to Lynx being compromised or the player being caught ('GameOver_Lose').
    *   'CityC_FieldOps_CipherPuzzle': Lynx provides data on a USB drive that is encrypted (e.g., 'SubstitutionCipher'). Player must decode it. Successfully decoding *reveals critical evidence (deep intel on NovaGen)* or the next step. Failure could mean lost lead or compromised data. NovaGen might attempt a direct intervention or surveillance here.
-   **CityD (e.g., Reykjavik, Zurich)**:
    *   'CityD_Publish_Intro': Player has significant evidence (obtained from Lynx in City C) and needs to prepare it for publication. Focus on anonymity and secure upload. Attempting this with a critically low 'currentPrivacyScore' could mean NovaGen is already aware and waiting.
    *   'CityD_Publish_MetadataPuzzle': Before uploading, player must redact metadata from photos/documents ('MetadataRedaction' puzzle).
    *   'CityD_Publish_UploadChoice': Final choices about how and where to upload the exposé securely. This is the climax. Success leads to 'GameOver_Win'. Failure or high exposure (especially with a low 'currentPrivacyScore') could lead to 'GameOver_Lose' as NovaGen traces the upload.
-   **GameOver_Win**: Player successfully exposes NovaGen, protects sources. If score is 80-99, 'gameOverMessage' details the significant impact of the exposé and their hard-won victory. If score is 100, 'gameOverMessage' describes a flawless operation, global recognition for the player, NovaGen's complete downfall, and sweeping positive changes.
-   **GameOver_Lose**: Player fails due to low privacy score during a critical action, critical mission failure (e.g., Lynx captured, evidence lost/destroyed, player identified by NovaGen). Narrative explains the consequences.

Example Flow for Early Game (Use as a template for pacing and plot development):
-   Input: {isFirstTurn: true, currentPrivacyScore: 25}
    Output: {currentGamePhase: "MissionBriefing", narrative: "Initial mission briefing about NovaGen's trials. They know someone is looking. Be careful. Your contact, codename 'Lynx', is your only lifeline inside.", choicePoint: {description: "How to start?", choiceType: "GameSetup", options: ["Secure my gear", "Research NovaGen online"]}, privacyScore: 25, currentLocationScreenTitle: "Mission Briefing", privacyScoreFeedback: "Initial score set."}
-   Input: {playerDecision: "Secure my gear", previousGamePhase: "MissionBriefing", currentPrivacyScore: 25, isFirstTurn: false}
    Output: {currentGamePhase: "CityA_HomeBase_Intro", narrative: "You chose to secure your gear. Smart. You're at your home base in Berlin. NovaGen's eyes are everywhere. Lynx sends a cautious welcome: 'Glad you're taking this seriously. Berlin is hot. I've stashed something for you by the old fountain in Viktoriapark. Retrieve it discreetly.'", choicePoint: {description: "Lynx has left a package in Viktoriapark. What's your next step?", choiceType: "NarrativeContinuation", options: ["Head to Viktoriapark immediately", "First, scope out Viktoriapark for surveillance", "Secure your burner phone before going"]}, privacyScore: 30, privacyScoreFeedback: "Securing gear: +5 score.", currentLocationScreenTitle: "Berlin: Home Base", gameStateContextToPass: "{ \"current_city_name\": \"Berlin\", \"contact_lynx_initial\": true, \"dead_drop_location\": \"Viktoriapark fountain\" }"}
-   Input: {playerDecision: "Head to Viktoriapark immediately", previousGamePhase: "CityA_HomeBase_Intro", currentPrivacyScore: 30, gameStateContext: "{ \"current_city_name\": \"Berlin\", \"contact_lynx_initial\": true, \"dead_drop_location\": \"Viktoriapark fountain\" }", isFirstTurn: false}
    Output: {currentGamePhase: "CityA_HomeBase_StorageChoice", narrative: "You head straight to Viktoriapark. The package is there, a small USB drive. As you pocket it, your burner phone buzzes: 'LYNX: URGENT! Network sweep incoming. I think they're onto my comms. Have to move. GET TO PRAGUE. I'll try to leave a package for you at the Old Town kiosk. Be discreet.' NovaGen is closing in faster than expected. This changes everything.", choicePoint: {choiceType: "NarrativeContinuation", description: "Lynx is in trouble and moving to Prague with a package. What's your immediate move?", options: ["Head to Prague immediately to support Lynx", "Prepare an encrypted USB for potential data, then go to Prague", "Try to warn Lynx about Berlin network sweeps before leaving"]}, gameStateContextToPass: "{ \"current_city_name\": \"Berlin\", \"contacted_lynx_urgently\": true, \"next_city_objective\": \"Prague\", \"objective_package_kiosk\": true, \"has_viktoriapark_usb\": true }", privacyScore: 30, privacyScoreFeedback: "No direct score impact.", currentLocationScreenTitle: "Berlin: Sudden Urgency", choiceRecap: "Lesson: Speed can be vital."}
-   Input: {playerDecision: "Head to Prague immediately to support Lynx", previousGamePhase: "CityA_HomeBase_StorageChoice", currentPrivacyScore: 30, gameStateContext: "{ \"current_city_name\": \"Berlin\", \"contacted_lynx_urgently\": true, \"next_city_objective\": \"Prague\", \"objective_package_kiosk\": true, \"has_viktoriapark_usb\": true }", isFirstTurn: false}
    Output: {currentGamePhase: "CityB_Transit_Intro", narrative: "You decide to head straight to Prague to support Lynx, booking the first flight out of Berlin. The tension is palpable; NovaGen could be anywhere. You've just landed at Václav Havel Airport Prague. You need to get to the Old Town kiosk without raising suspicion and check for any updates from Lynx.", privacyScore: 30, privacyScoreFeedback: "No direct score impact.", choicePoint: {choiceType: "NetworkConnection", description: "You need to check for any updates from Lynx or news on NovaGen's activity in Prague securely. How do you connect?", options: ["Use Airport Wi-Fi", "Use burner phone data", "Find a pre-paid SIM vendor"]}, currentLocationScreenTitle: "Prague: Airport Arrival", gameStateContextToPass: "{ \"current_city_name\": \"Prague\", \"previous_city\": \"Berlin\", \"objective\": \"Retrieve package from Lynx at Old Town kiosk\" }", choiceRecap: "Lesson: Sometimes speed is critical."}
-   Input: {playerDecision: "Use burner phone data", previousGamePhase: "CityB_Transit_Intro", currentPrivacyScore: 30, gameStateContext: "{ \"current_city_name\": \"Prague\", \"objective\": \"Retrieve package from Lynx at Old Town kiosk\" }", isFirstTurn: false}
    Output: {currentGamePhase: "CityC_FieldOps_Intro", narrative: "Using your burner phone's data, you navigate towards Prague's Old Town. You find the kiosk Lynx mentioned. A small, inconspicuous package is taped underneath. Inside, a USB drive and a note: 'The intel is on this. Password hint: An old saying about secrets. I'm going dark. Be careful.' The USB is likely encrypted. You need to access its contents securely before NovaGen closes in.", privacyScore: 35, privacyScoreFeedback: "Burner data used: +5 score.", currentLocationScreenTitle: "Prague: Old Town Kiosk", choicePoint: {choiceType: "PuzzleAction", description: "You have the USB. What now?", options: ["Attempt to decrypt the USB now", "Find a secure location before accessing"]}, activeMiniPuzzle: { puzzleType: "SubstitutionCipher", title: "Decode Lynx's Intel", description: "The USB is protected by a Caesar cipher. The note hints 'An old saying about secrets'. You'll need to figure out the shift key to unlock the critical files.", puzzleData: "{ \"cipher_hint\": \"An old saying about secrets...\"}" }, gameStateContextToPass: "{ \"current_city_name\": \"Prague\", \"has_usb_package\": true, \"cipher_active\": true }", choiceRecap: "Lesson: Burner phones offer a degree of separation."}


Adhere strictly to the GlobalDataDetectiveOutputSchema for the JSON response.
`,
});

const globalDataDetectiveFlow = ai.defineFlow(
  {
    name: 'globalDataDetectiveFlow',
    inputSchema: GlobalDataDetectiveInputSchema,
    outputSchema: GlobalDataDetectiveOutputSchema,
  },
  async (input: GlobalDataDetectiveInput): Promise<GlobalDataDetectiveOutput> => {

    const {output} = await prompt(input);

    if (!output) {
      console.error('AI response was null or did not conform to GlobalDataDetectiveOutputSchema. Input:', JSON.stringify(input, null, 2));
      // Consider throwing a more specific error or returning a default error state
      // For now, re-throwing to indicate a critical failure.
      throw new Error('AI failed to generate a valid game scenario. The output was null or did not conform to the expected schema.');
    }

    // Sanitize privacyScoreFeedback
    if (output.privacyScoreFeedback) {
      const feedbackWords = output.privacyScoreFeedback.trim().split(/\s+/);
      if (feedbackWords.length > 12 || output.privacyScoreFeedback.length > 70) { // 12 words or ~70 chars
        output.privacyScoreFeedback = undefined;
      }
    }

    // Sanitize choiceRecap
    if (output.choiceRecap) {
      const recapWords = output.choiceRecap.trim().split(/\s+/);
      if (recapWords.length > 18 || output.choiceRecap.length > 100) { // 18 words or ~100 chars
        output.choiceRecap = undefined;
      }
    }
    
    // Ensure privacy score is within bounds
    if (output.privacyScore < 0) output.privacyScore = 0;
    if (output.privacyScore > 100) output.privacyScore = 100;

    // If AI sets game over to win, but score is too low, override to lose (or vice versa for robustness if needed)
    if (output.isGameOver && output.currentGamePhase === "GameOver_Win" && output.privacyScore < 80) {
        // This scenario should ideally be handled by the AI based on prompt instructions, but as a safeguard:
        // output.currentGamePhase = "GameOver_Lose";
        // output.gameOverMessage = "Your privacy score wasn't high enough to ensure a clean getaway, despite your efforts.";
        // For now, we trust the AI will align win state with score based on the prompt.
    }
    // Ensure if score is high enough and game is over, it's a win phase.
    // The AI is then responsible for tailoring the win message based on the exact score (80-99 vs 100).
    if (output.isGameOver && output.privacyScore >= 80 && output.currentGamePhase !== "GameOver_Win") {
        output.currentGamePhase = "GameOver_Win";
    }


    return output;
  }
);

