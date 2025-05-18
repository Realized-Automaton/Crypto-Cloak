
// src/lib/game-script.ts

export interface GameChoice {
  text: string;
  nextSceneId: string;
  privacyScoreEffect?: number;
  feedback?: string;
  lesson?: string;
  setsFlags?: string[];
  clearsFlags?: string[];
  requiresFlags?: string[];
  requiresMissingFlags?: string[];
}

interface MetadataItem {
  id: string;
  label: string;
  sensitive: boolean;
}

interface MetadataRedactionPuzzleData {
  items: MetadataItem[];
}

export interface MiniPuzzle {
  type: 'PassphraseChallenge' | 'VPNSetup' | 'SubstitutionCipher' | 'MetadataRedaction';
  title: string;
  description: string;
  puzzleData?: MetadataRedactionPuzzleData | any; // puzzleData can be specific to the puzzle type
}

export interface GameScene {
  id: string;
  locationTitle: string;
  image?: string;
  imageHint?: string;
  narrative: string;
  choices: GameChoice[];
  isGameOver?: boolean;
  isWin?: boolean;
  gameOverMessage?: string;
  miniPuzzle?: MiniPuzzle;
}

export interface GameScript {
  [sceneId: string]: GameScene;
}

export const INITIAL_SCENE_ID = 'missionBriefing';
export const INITIAL_PRIVACY_SCORE = 25; // Starting score

export const gameScript: GameScript = {
  [INITIAL_SCENE_ID]: {
    id: INITIAL_SCENE_ID,
    locationTitle: "Mission Briefing",
    image: "https://i.ibb.co/bGdSqfy/biotech-firm-novagen-in-the-background-an-eery-om.jpg",
    imageHint: "biotech firm building",
    narrative: "Welcome Detective,\n\nA whistleblower inside NovaGen claims the biotech giant is running illegal human trials—no consent, no oversight. People are dying, and NovaGen is erasing the evidence.\n\nYour mission: Gather irrefutable proof, expose NovaGen's crimes to the world, and protect your source codenamed: Lynx\n\nThink smart, one wrong step, and you’re next.",
    choices: [
      { text: "Secure my primary communication channels first.", nextSceneId: "berlin_setup_comms", privacyScoreEffect: 5, feedback: "Securing comms is a smart first step. +5 Score." },
      { text: "Organize my gear and secure my data storage.", nextSceneId: "berlin_setup_gear", privacyScoreEffect: 5, feedback: "Prioritizing secure gear is wise. +5 Score." },
      { text: "Begin by researching NovaGen's public activities.", nextSceneId: "berlin_setup_research", privacyScoreEffect: 0, feedback: "Public research is low risk for now. No score change." },
    ],
  },

  // --- BERLIN (City A) ---
  'berlin_setup_comms': {
    id: 'berlin_setup_comms',
    locationTitle: "Berlin: Home Base - Comms Secured",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "secure home office",
    narrative: "You've prioritized securing your communication channels. From your temporary base in Berlin, you meticulously set up encrypted email and a secure messaging app.\n\nSuddenly, a new encrypted message pings in from 'Lynx':\n'Berlin is getting hot. They suspect a leak. I've stashed preliminary data for you - a USB drive. It's at the old fountain in Viktoriapark. Retrieve it discreetly. Be quick, be careful.'",
    choices: [
      { text: "Head to Viktoriapark immediately to retrieve the USB.", nextSceneId: "berlin_viktoriapark_direct", privacyScoreEffect: -5, feedback: "Rushing to a dead drop is risky. -5 Score." },
      { text: "First, thoroughly scope out Viktoriapark for NovaGen surveillance.", nextSceneId: "berlin_viktoriapark_scout", privacyScoreEffect: 5, feedback: "Scouting first is good OPSEC. +5 Score." },
      { text: "Prepare a burner phone before going to Viktoriapark.", nextSceneId: "berlin_viktoriapark_prep_burner", privacyScoreEffect: 3, feedback: "A burner phone adds a layer of security. +3 Score." }
    ]
  },
  'berlin_setup_gear': {
    id: 'berlin_setup_gear',
    locationTitle: "Berlin: Home Base - Gear Secured",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "secure home office",
    narrative: "You've focused on securing your gear. Working from your Berlin base, you encrypt your primary laptop and set up a secure external vault for sensitive files.\n\nAs you finish, an encrypted message arrives from 'Lynx':\n'Good, you're taking precautions. They're definitely aware someone is digging. I've left initial evidence on a USB at the dead drop near the Brandenburg Gate, taped under the third bench from the east. Be very careful.'",
    choices: [
      { text: "Go to the Brandenburg Gate now to get the USB.", nextSceneId: "berlin_brandenburg_direct", privacyScoreEffect: -5, feedback: "Heading directly to a known landmark is risky. -5 Score." },
      { text: "Scout the Brandenburg Gate area thoroughly before approaching.", nextSceneId: "berlin_brandenburg_scout", privacyScoreEffect: 5, feedback: "Good call scouting first. +5 Score." },
      { text: "Send a coded reply to Lynx confirming receipt but requesting a less public drop.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: -2, feedback: "Questioning a source's drop can be risky. -2 Score."}
    ]
  },
  'berlin_setup_research': {
    id: 'berlin_setup_research',
    locationTitle: "Berlin: Home Base - Initial Research",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "research desk home",
    narrative: "You start by researching NovaGen's public profile from your Berlin hideout. Standard corporate website, press releases... nothing overtly suspicious, but their digital infrastructure seems robust.\n\nAs you dig, a secure message from 'Lynx' cuts through:\n'They're hunting for the source of the leak. I can't risk direct contact for long. I've left a USB with key data at a public phone booth on Karl-Marx-Allee, hidden in the coin return. Urgent you get it.'",
    choices: [
      { text: "Go to the Karl-Marx-Allee phone booth immediately.", nextSceneId: "berlin_karlmarxallee_direct", privacyScoreEffect: -5, feedback: "Public and potentially watched. -5 Score." },
      { text: "Scout the Karl-Marx-Allee area before approaching.", nextSceneId: "berlin_karlmarxallee_scout", privacyScoreEffect: 5, feedback: "Wise to scout. +5 Score." },
      { text: "Use a public computer at a library to research the phone booth's location history for known surveillance.", nextSceneId: "berlin_karlmarxallee_research_booth", privacyScoreEffect: 3, feedback: "Smart use of public resources. +3 Score." }
    ]
  },

  // Viktoriapark Path
  'berlin_viktoriapark_direct': {
    id: 'berlin_viktoriapark_direct',
    locationTitle: "Berlin: Viktoriapark - Risky Move",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "park fountain danger Viktoriapark",
    narrative: "You head directly to the fountain. As you reach for the package, you notice two men in dark coats observing you. They start moving in your direction.\n\nYou manage to grab the USB but they're closing in!",
    choices: [
      { text: "Try to lose them in the park's crowds.", nextSceneId: "berlin_viktoriapark_escape_attempt", privacyScoreEffect: -5, feedback: "Direct confrontation or escape is very risky. -5 Score." }, 
      { text: "Drop the USB and act like a lost tourist.", nextSceneId: "berlin_lose_usb_A", privacyScoreEffect: -5, feedback: "Losing evidence is a major setback. -5 Score.", setsFlags: ["lost_usb_A"] }, 
      { text: "Quickly swallow a decoy USB and pretend to be ill.", nextSceneId: "berlin_viktoriapark_decoy_ploy", privacyScoreEffect: 2, feedback: "A risky but potentially clever ploy. +2 Score." }
    ],
  },
  'berlin_viktoriapark_scout': {
    id: 'berlin_viktoriapark_scout',
    locationTitle: "Berlin: Viktoriapark Recon",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "park surveillance discreet Viktoriapark",
    narrative: "Your careful scouting of Viktoriapark pays off. You spot two individuals who look out of place, subtly monitoring the fountain area.\n\nToo risky for a direct retrieval now.",
    choices: [
      { text: "Create a diversion to draw them away.", nextSceneId: "berlin_viktoriapark_diversion_attempt", privacyScoreEffect: 0, feedback: "A diversion might work... or attract more attention." },
      { text: "Abort and try to contact Lynx for an alternative drop.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 2, feedback: "Avoiding a risky situation is smart. +2 Score." },
      { text: "Wait them out, observing from a distance for an opening.", nextSceneId: "berlin_viktoriapark_wait_out", privacyScoreEffect: 1, feedback: "Patience can be a virtue. +1 Score." }
    ]
  },
  'berlin_viktoriapark_prep_burner': {
    id: 'berlin_viktoriapark_prep_burner',
    locationTitle: "Berlin: Viktoriapark - Burner Ready",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "burner phone park bench Viktoriapark",
    narrative: "You acquire and set up a burner phone before heading to Viktoriapark. It's untraceable for now.\n\nYou arrive at the park. The fountain area seems quiet. What's your approach?",
    choices: [
       { text: "Go directly for the USB, keeping the burner active for quick comms if needed.", nextSceneId: "berlin_viktoriapark_direct_burner_active", privacyScoreEffect: -2, feedback: "Still a bit risky, but burner helps. -2 Score." },
       { text: "Scout the area first, even with the burner.", nextSceneId: "berlin_viktoriapark_scout", privacyScoreEffect: 5, feedback: "Double caution is good. +5 Score." },
       { text: "Use the burner to set up a false meet elsewhere to test for tails.", nextSceneId: "berlin_viktoriapark_false_meet_test", privacyScoreEffect: 3, feedback: "Clever use of the burner. +3 Score."}
    ]
  },
  'berlin_viktoriapark_direct_burner_active': {
    id: 'berlin_viktoriapark_direct_burner_active',
    locationTitle: "Berlin: Viktoriapark - Cautious Direct",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "park fountain retrieval success Viktoriapark",
    narrative: "With your burner phone ready, you approach the fountain. The area appears clear. You quickly retrieve the USB.\n\nMission accomplished for this step.",
    choices: [
      { text: "Head back to base to analyze the USB.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Good job. +5 Score."}
    ]
  },
  'berlin_viktoriapark_false_meet_test': {
    id: 'berlin_viktoriapark_false_meet_test',
    locationTitle: "Berlin: Viktoriapark - Testing the Waters",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "park observation distant Viktoriapark",
    narrative: "You use the burner to send a coded message hinting at a meet-up on the other side of Viktoriapark. From a distance, you observe. No suspicious activity seems drawn to your false location.\n\nIt seems safe to proceed with the real drop.",
    choices: [
      { text: "Proceed to the fountain to retrieve the USB.", nextSceneId: "berlin_viktoriapark_retrieve_success", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Smart test, clear retrieval. +5 Score." },
      { text: "Still too risky, the lack of reaction could be a trap too. Contact Lynx.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 1, feedback: "Extreme caution. +1 Score." }
    ]
  },
  'berlin_viktoriapark_escape_attempt': {
    id: 'berlin_viktoriapark_escape_attempt',
    locationTitle: "Berlin: Viktoriapark - On the Run",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "chase scene city park Viktoriapark",
    narrative: "You bolt, weaving through tourists and trees. The men are surprisingly agile. After a heart-pounding chase, you think you've lost them, clutching the USB.\n\nBut you know they got a good look at you.",
    choices: [
      { text: "Ditch this identity and safe house. Lay low for a bit.", nextSceneId: "berlin_lay_low_compromised", privacyScoreEffect: -5, feedback: "Your cover is blown. Major setback. -5 Score.", setsFlags: ["usb_A_retrieved", "identity_compromised_berlin"] }, 
      { text: "Risk going back to your base to analyze the USB immediately.", nextSceneId: "berlin_analyze_usb_A_securely_risky", privacyScoreEffect: -5, feedback: "Extremely risky! -5 Score.", setsFlags: ["usb_A_retrieved", "identity_compromised_berlin"] } 
    ]
  },
   'berlin_viktoriapark_decoy_ploy': {
    id: 'berlin_viktoriapark_decoy_ploy',
    locationTitle: "Berlin: Viktoriapark - Decoy Success?",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "confusion park distraction Viktoriapark",
    narrative: "You dramatically swallow a decoy USB and feign a sudden illness. The observers seem confused and hesitant. This gives you a window.\n\nYou discretely palm the real USB.",
    choices: [
      { text: "Use the confusion to slip away and analyze the real USB.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Risky but well-executed! +5 Score." },
      { text: "The ploy bought time, but they're still suspicious. Abort and contact Lynx.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 0, feedback: "They might be watching Lynx too." },
      { text: "Exaggerate illness further to get medical attention and a clean exit.", nextSceneId: "berlin_viktoriapark_medical_exit", privacyScoreEffect: 1, feedback: "A bold move to ensure escape. +1 Score." }
    ]
  },
  'berlin_viktoriapark_medical_exit': {
    id: 'berlin_viktoriapark_medical_exit',
    locationTitle: "Berlin: Viktoriapark - Medical Diversion",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "paramedics park scene Viktoriapark",
    narrative: "Your feigned illness is convincing enough that concerned onlookers call for medical assistance. The NovaGen watchers back off as paramedics arrive.\n\nYou manage to palm the real USB and are whisked away, creating a clean break.",
    choices: [
      { text: "Once clear, head to your base to analyze the USB.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Unconventional but effective escape! +5 Score." }
    ]
  },
  'berlin_viktoriapark_diversion_attempt': {
    id: 'berlin_viktoriapark_diversion_attempt',
    locationTitle: "Berlin: Viktoriapark - Diversion",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "park distraction event Viktoriapark",
    narrative: "You orchestrate a minor commotion on the far side of the park – a dropped tourist map causing a brief argument. The watchers glance over, distracted for a moment.\n\nThis is your chance!",
    choices: [
      { text: "Quickly retrieve the USB while they're looking away.", nextSceneId: "berlin_viktoriapark_retrieve_success", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Diversion successful! +5 Score." },
      { text: "The diversion wasn't enough. They're still alert. Abort.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: -2, feedback: "Diversion failed. Wasted effort. -2 Score." },
      { text: "Use the diversion to get closer and observe the watchers more.", nextSceneId: "berlin_viktoriapark_observe_watchers", privacyScoreEffect: 1, feedback: "Gathering more intel. +1 Score." }
    ]
  },
  'berlin_viktoriapark_observe_watchers': {
    id: 'berlin_viktoriapark_observe_watchers',
    locationTitle: "Berlin: Viktoriapark - Closer Look",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "surveillance observation park Viktoriapark",
    narrative: "Using the commotion as cover, you get a better look at the watchers. They seem professional, likely NovaGen's internal security. One is speaking into a concealed microphone.\n\nThe dead drop is definitely hot.",
    choices: [
      { text: "Abort the retrieval. The risk is too high. Contact Lynx.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 3, feedback: "Good intel, wise to abort. +3 Score." },
      { text: "Attempt a very quick, risky retrieval anyway.", nextSceneId: "berlin_viktoriapark_direct", privacyScoreEffect: -5, feedback: "High risk against professionals! -5 Score."}
    ]
  },
  'berlin_viktoriapark_wait_out': {
    id: 'berlin_viktoriapark_wait_out',
    locationTitle: "Berlin: Viktoriapark - Patience",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "waiting park bench long Viktoriapark",
    narrative: "Hours pass. The watchers eventually seem to relax, one leaving for a coffee.\n\nIt's not perfect, but it might be the best opening you'll get.",
    choices: [
      { text: "Seize the moment and retrieve the USB.", nextSceneId: "berlin_viktoriapark_retrieve_success", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Patience paid off. +5 Score."},
      { text: "Too risky, one is still there. Contact Lynx for another way.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 1, feedback: "Prudence over valor. +1 Score."},
      { text: "Try to follow the watcher who left for coffee.", nextSceneId: "berlin_viktoriapark_follow_watcher", privacyScoreEffect: -2, feedback: "Risky and could lead you away from the objective. -2 Score."}
    ]
  },
  'berlin_viktoriapark_follow_watcher': {
    id: 'berlin_viktoriapark_follow_watcher',
    locationTitle: "Berlin: Viktoriapark - Tailing a Watcher",
    image: "https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png",
    imageHint: "street tailing spy Viktoriapark",
    narrative: "You discreetly follow the watcher. They go to a nearby cafe, make a quick call, and return.\n\nYou didn't learn much, and the window of opportunity at the fountain might have closed.",
    choices: [
      { text: "Return to the fountain, hope for another chance.", nextSceneId: "berlin_viktoriapark_wait_out", privacyScoreEffect: -1, feedback: "Lost time. -1 Score." },
      { text: "Abort. Contact Lynx for new instructions.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 0, feedback: "Better safe than sorry." }
    ]
  },
  'berlin_viktoriapark_retrieve_success': {
    id: 'berlin_viktoriapark_retrieve_success',
    locationTitle: "Berlin: Viktoriapark - USB Secured!",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "home office usb Viktoriapark",
    narrative: "Success! You've retrieved the USB drive from the Viktoriapark fountain. Time to see what vital information Lynx has provided.\n\nYou head back to your Berlin home base.",
    choices: [
      { text: "Analyze the USB on your encrypted primary laptop.", nextSceneId: "berlin_analyze_usb_A_securely", privacyScoreEffect: 5, feedback: "Good choice. +5 Score." },
      { text: "Use your burner phone and a secure cloud service to inspect the files.", nextSceneId: "berlin_analyze_usb_A_burner_cloud", privacyScoreEffect: 2, feedback: "Moderately secure, but cloud has risks. +2 Score." },
      { text: "Find a nearby internet cafe to quickly check the USB (risky).", nextSceneId: "berlin_analyze_usb_A_cafe", privacyScoreEffect: -5, feedback: "Very risky! Public cafes are not secure. -5 Score." } 
    ]
  },

  // Brandenburg Gate Path
   'berlin_brandenburg_direct': {
    id: 'berlin_brandenburg_direct',
    locationTitle: "Berlin: Brandenburg Gate - Direct Retrieval",
    image: "https://i.ibb.co/kVG2249f/brandenburg-gate-berlin.jpg",
    imageHint: "Brandenburg Gate tourist",
    narrative: "You walk directly to the specified bench near Brandenburg Gate. It's a busy tourist spot. You locate the tape and retrieve the USB.\n\nAs you turn to leave, a glint from a nearby rooftop catches your eye - a camera lens?",
    choices: [
      { text: "Quickly blend into the crowd and leave.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved", "possibly_photographed_berlin"], privacyScoreEffect: 0, feedback: "You got the USB, but might have been spotted." },
      { text: "Investigate the source of the glint.", nextSceneId: "berlin_brandenburg_confront_surveillance", privacyScoreEffect: -5, feedback: "Confronting potential surveillance is dangerous. -5 Score." }, 
      { text: "Create a small, believable distraction and then leave.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 3, feedback: "Quick thinking to cover your tracks. +3 Score." }
    ]
  },
  'berlin_brandenburg_scout': {
    id: 'berlin_brandenburg_scout',
    locationTitle: "Berlin: Brandenburg Gate - Scouting",
    image: "https://i.ibb.co/kVG2249f/brandenburg-gate-berlin.jpg",
    imageHint: "Brandenburg Gate observation point",
    narrative: "You spend an hour scouting the Brandenburg Gate area. It's bustling. You notice a couple of plainclothes individuals lingering too long near the target bench, occasionally speaking into hidden mics.\n\nDefinitely surveillance.",
    choices: [
      { text: "Abort. Contact Lynx for a new drop point.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 3, feedback: "Good call, avoiding a trap. +3 Score." },
      { text: "Attempt a 'brush pass' retrieval if they get distracted.", nextSceneId: "berlin_brandenburg_brush_pass", privacyScoreEffect: -5, feedback: "High risk maneuver. -5 Score." },
      { text: "Report the surveillance to your handler and await instructions.", nextSceneId: "berlin_report_surveillance_wait", privacyScoreEffect: 1, feedback: "Following protocol. +1 Score." }
    ]
  },
  'berlin_brandenburg_confront_surveillance': {
    id: 'berlin_brandenburg_confront_surveillance',
    locationTitle: "Berlin: Brandenburg Gate - Confrontation",
    image: "https://i.ibb.co/kVG2249f/brandenburg-gate-berlin.jpg",
    imageHint: "rooftop tense confrontation Brandenburg Gate",
    narrative: "You decide to trace the glint. It leads you to a nearby building's rooftop access.\n\nAs you emerge, two NovaGen operatives confront you. 'Lost, detective?' one smirks.",
    choices: [
      { text: "Attempt to fight your way out (you still have the USB).", nextSceneId: "gameOver_lose_caught_early", privacyScoreEffect: -20, gameOverMessage: "NovaGen's operatives were waiting. You fought bravely but were overwhelmed. Mission failed." },
      { text: "Try to talk your way out, feigning ignorance.", nextSceneId: "berlin_brandenburg_talk_way_out", privacyScoreEffect: -5, feedback: "They likely don't believe you. -5 Score." },
      { text: "Offer them a bribe (if you have disposable 'dirty' crypto).", nextSceneId: "berlin_brandenburg_bribe_attempt", privacyScoreEffect: -3, feedback: "Bribes are risky and attract wrong attention. -3 Score." }
    ]
  },
  'berlin_brandenburg_bribe_attempt': {
    id: 'berlin_brandenburg_bribe_attempt',
    locationTitle: "Berlin: Brandenburg Gate - Bribe",
    image: "https://i.ibb.co/kVG2249f/brandenburg-gate-berlin.jpg",
    imageHint: "crypto transaction tense Brandenburg Gate",
    narrative: "You offer a significant sum in untraceable crypto. One operative seems tempted, the other scoffs. 'We're not that cheap.'\n\nThey take the crypto, rough you up a bit, and let you go, but keep the USB. 'Consider it a lesson.'",
    choices: [
      { text: "Get out of Berlin. The USB is lost, and they know your face.", nextSceneId: "prague_travel_immediate_urgent", setsFlags: ["identity_compromised_berlin", "lost_usb_A"], privacyScoreEffect: -5, feedback: "Lost evidence and compromised. -5 Score."} 
    ]
  },
   'berlin_brandenburg_talk_way_out': {
    id: 'berlin_brandenburg_talk_way_out',
    locationTitle: "Berlin: Brandenburg Gate - Tight Spot",
    image: "https://i.ibb.co/kVG2249f/brandenburg-gate-berlin.jpg",
    imageHint: "tense negotiation Berlin Brandenburg Gate",
    narrative: "You play dumb, pretending to be a photographer. They don't seem entirely convinced but let you go with a stern warning after confiscating your (decoy) camera.\n\nYou managed to keep the real USB hidden.",
    choices: [
      { text: "Get out of Berlin immediately. This identity is burned.", nextSceneId: "prague_travel_immediate_urgent", setsFlags: ["usb_A_retrieved", "identity_compromised_berlin"], privacyScoreEffect: -5, feedback: "Berlin is too hot! -5 Score."}, 
      { text: "Risk analyzing the USB in Berlin before leaving.", nextSceneId: "berlin_analyze_usb_A_securely_risky", setsFlags: ["usb_A_retrieved", "identity_compromised_berlin"], privacyScoreEffect: -5, feedback: "Very risky with compromised identity. -5 Score."}, 
      { text: "Double back later to see if they're still watching the area.", nextSceneId: "berlin_brandenburg_double_back", privacyScoreEffect: 0, feedback: "Risky, but could provide intel." }
    ]
  },
  'berlin_brandenburg_double_back': {
    id: 'berlin_brandenburg_double_back',
    locationTitle: "Berlin: Brandenburg Gate - Re-Scout",
    image: "https://i.ibb.co/kVG2249f/brandenburg-gate-berlin.jpg",
    imageHint: "night observation Brandenburg Gate",
    narrative: "Hours later, under the cover of darkness, you return to observe the Brandenburg Gate. The previous operatives are gone, but a different, more covert team seems to be sweeping the area.\n\nThey are definitely aware of your earlier presence.",
    choices: [
      { text: "Leave Berlin now. It's too dangerous.", nextSceneId: "prague_travel_immediate_urgent", setsFlags: ["usb_A_retrieved", "identity_compromised_berlin"], privacyScoreEffect: -5, feedback: "Berlin is compromised. -5 Score." }, 
      { text: "Attempt to analyze the USB in a different, secure location in Berlin.", nextSceneId: "berlin_analyze_usb_A_securely_risky", setsFlags: ["usb_A_retrieved", "identity_compromised_berlin"], privacyScoreEffect: -3, feedback: "High risk. -3 Score." }
    ]
  },
  'berlin_brandenburg_brush_pass': {
    id: 'berlin_brandenburg_brush_pass',
    locationTitle: "Berlin: Brandenburg Gate - Brush Pass",
    image: "https://i.ibb.co/kVG2249f/brandenburg-gate-berlin.jpg",
    imageHint: "crowded street quick exchange Brandenburg Gate",
    narrative: "You wait for a surge of tourists. In the chaos, you manage a swift 'brush pass', snatching the USB from under the bench.\n\nIt was clumsy, and one of the operatives clearly noticed your maneuver.",
    choices: [
      { text: "Disappear into the crowd, hoping they didn't get a clear ID.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved", "possibly_photographed_berlin"], privacyScoreEffect: -2, feedback: "Risky, but you have the USB. -2 Score." },
      { text: "Drop a smoke pellet (you had one for emergencies) and escape.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Dramatic, but effective escape! +5 Score." },
      { text: "Immediately ditch the USB in a nearby bin to avoid being caught with it.", nextSceneId: "berlin_lose_usb_A", privacyScoreEffect: -5, feedback: "Lost the USB to evade capture. -5 Score.", setsFlags: ["lost_usb_A"] } 
    ]
  },
  'berlin_report_surveillance_wait': {
    id: 'berlin_report_surveillance_wait',
    locationTitle: "Berlin: Awaiting Instructions",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "home office communication",
    narrative: "You report the surveillance at Brandenburg Gate to your handler. They advise aborting that retrieval and tell you Lynx will attempt a new communication soon with an alternative.\n\nFor now, focus on general NovaGen research or secure your local setup.",
    choices: [
      { text: "Focus on encrypting all local files while waiting.", nextSceneId: "berlin_wait_encrypt_files", privacyScoreEffect: 3, feedback: "Good use of downtime. +3 Score." },
      { text: "Research NovaGen's Berlin office for vulnerabilities.", nextSceneId: "berlin_wait_research_office", privacyScoreEffect: 1, feedback: "Could be useful. +1 Score." },
      { text: "Set up counter-surveillance measures around your base.", nextSceneId: "berlin_wait_counter_surveillance", privacyScoreEffect: 2, feedback: "Proactive defense. +2 Score."}
    ]
  },
  'berlin_wait_counter_surveillance': {
    id: 'berlin_wait_counter_surveillance',
    locationTitle: "Berlin: Fortifying Base",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "security cameras setup home",
    narrative: "You spend time setting up basic counter-surveillance around your Berlin base – motion detectors, obscured cameras. It gives you a slight peace of mind.\n\nLater, Lynx's new message arrives: 'Brandenburg was compromised. New plan: I've uploaded encrypted files to a temporary secure server. Access key at a geocache in Teufelsberg. Coordinates to follow.'",
    choices: [
      { text: "Acknowledge and prepare for Teufelsberg.", nextSceneId: "berlin_teufelsberg_prep", privacyScoreEffect: 1, feedback: "New plan. +1 Score."}
    ]
  },
  'berlin_wait_encrypt_files': {
    id: 'berlin_wait_encrypt_files',
    locationTitle: "Berlin: Securing Data",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "laptop encryption progress",
    narrative: "You spend the time encrypting everything. Hours later, a new message from Lynx: 'Brandenburg was compromised. My apologies. New plan: I've uploaded encrypted files to a temporary secure server. The access key is hidden in a geocache at Teufelsberg. Coordinates to follow. This is safer.'",
    choices: [
      { text: "Acknowledge and prepare to go to Teufelsberg.", nextSceneId: "berlin_teufelsberg_prep", privacyScoreEffect: 0, feedback: "New plan from Lynx." },
    ]
  },
   'berlin_wait_research_office': {
    id: 'berlin_wait_research_office',
    locationTitle: "Berlin: Researching NovaGen Office",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "blueprints research desk",
    narrative: "Your research into NovaGen's Berlin office reveals some interesting security flaws in their network architecture but nothing immediately exploitable.\n\nThen, a new message from Lynx: 'Brandenburg was compromised. My apologies. New plan: I've uploaded encrypted files to a temporary secure server. The access key is hidden in a geocache at Teufelsberg. Coordinates to follow. This is safer.'",
    choices: [
      { text: "Acknowledge and prepare to go to Teufelsberg.", nextSceneId: "berlin_teufelsberg_prep", privacyScoreEffect: 0, feedback: "New plan from Lynx." },
    ]
  },

  // Karl-Marx-Allee Path
  'berlin_karlmarxallee_direct': {
    id: 'berlin_karlmarxallee_direct',
    locationTitle: "Berlin: Karl-Marx-Allee - Ambush!",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "street phone booth night ambush Karl-Marx-Allee",
    narrative: "You rush to the phone booth on Karl-Marx-Allee. As you reach into the coin return, a black van screeches to a halt beside you. Doors fly open, figures emerge.\n\nIt's an ambush!",
    choices: [
      { text: "Fight back! You won't go down easy.", nextSceneId: "gameOver_lose_caught_early", privacyScoreEffect: -20, gameOverMessage: "NovaGen's goons were too many. You were captured. Mission Failed." },
      { text: "Attempt a desperate escape into the nearby U-Bahn station.", nextSceneId: "berlin_karlmarxallee_escape_ubahn", privacyScoreEffect: -5, feedback: "A desperate move! -5 Score." }, 
      { text: "Surrender, hoping to protect Lynx by not resisting.", nextSceneId: "gameOver_lose_caught_early", privacyScoreEffect: -20, gameOverMessage: "You surrendered, but NovaGen shows no mercy. Mission Failed." }
    ]
  },
  'berlin_karlmarxallee_scout': {
    id: 'berlin_karlmarxallee_scout',
    locationTitle: "Berlin: Karl-Marx-Allee - Recon",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "street observation cafe Karl-Marx-Allee",
    narrative: "You scout Karl-Marx-Allee from a cafe across the street. A black van with tinted windows has been parked near the phone booth for over an hour. Definitely suspicious.\n\nThis looks like a trap.",
    choices: [
      { text: "Abort the retrieval. Inform Lynx the drop is compromised.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 5, feedback: "Smart move. You avoided a trap. +5 Score." },
      { text: "Try to create a diversion to see how the van reacts.", nextSceneId: "berlin_karlmarxallee_diversion_van", privacyScoreEffect: 0, feedback: "Might give you more info, or expose you." },
      { text: "Call the police anonymously to report a suspicious vehicle.", nextSceneId: "berlin_karlmarxallee_call_police", privacyScoreEffect: -2, feedback: "Involving police is unpredictable. -2 Score." }
    ]
  },
  'berlin_karlmarxallee_research_booth': {
    id: 'berlin_karlmarxallee_research_booth',
    locationTitle: "Berlin: Library Research",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "library computer research screen Karl-Marx-Allee nearby",
    narrative: "At a public library near Karl-Marx-Allee, you research the phone booth's location. Recent local news forums mention 'increased plainclothes police activity' in that specific area due to unrelated incidents.\n\nIt's not NovaGen, but still a high-risk zone for a discreet pickup.",
    choices: [
      { text: "Proceed with extreme caution, it might be clear of NovaGen.", nextSceneId: "berlin_karlmarxallee_direct_police_risk", privacyScoreEffect: -5, feedback: "High risk due to police presence. -5 Score." }, 
      { text: "Abort. Too much heat. Inform Lynx.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 4, feedback: "Good call avoiding the area. +4 Score." },
      { text: "Use a disguise and attempt the pickup during a busy time.", nextSceneId: "berlin_karlmarxallee_disguise_pickup", privacyScoreEffect: -2, feedback: "Disguise helps, but still risky with police. -2 Score."}
    ]
  },
  'berlin_karlmarxallee_disguise_pickup': {
    id: 'berlin_karlmarxallee_disguise_pickup',
    locationTitle: "Berlin: Karl-Marx-Allee - Disguised Attempt",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "disguise street pickup Karl-Marx-Allee",
    narrative: "You don a convincing disguise as a utility worker and approach the phone booth during a bustling lunch hour. You manage to retrieve the USB, but a nearby patrol officer gives you a long, hard stare.\n\nYou walk away calmly.",
    choices: [
      { text: "Head back to base quickly to analyze the USB.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved", "possibly_seen_by_police_kma"], privacyScoreEffect: 1, feedback: "Got it, but attracted police attention. +1 Score."}
    ]
  },
  'berlin_karlmarxallee_escape_ubahn': {
    id: 'berlin_karlmarxallee_escape_ubahn',
    locationTitle: "Berlin: U-Bahn Chase",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "subway station chase scene near Karl-Marx-Allee",
    narrative: "You sprint for the U-Bahn entrance, NovaGen goons hot on your heels. You manage to leap onto a departing train just as the doors close.\n\nYou escaped, but without the USB, and they know you're in Berlin.",
    choices: [
      { text: "Contact Lynx, report the ambush, and request new instructions.", nextSceneId: "berlin_contact_lynx_alternative_A", setsFlags: ["identity_compromised_berlin", "failed_usb_A_retrieval"], privacyScoreEffect: -5, feedback: "Lost the USB and compromised. -5 Score." },
      { text: "Ditch burner phone, lay low, and try to leave Berlin quietly.", nextSceneId: "berlin_lay_low_escape_city", setsFlags: ["identity_compromised_berlin", "failed_usb_A_retrieval"], privacyScoreEffect: -3, feedback: "Escaped immediate danger, but mission setback. -3 Score."}
    ]
  },
  'berlin_lay_low_escape_city': {
    id: 'berlin_lay_low_escape_city',
    locationTitle: "Berlin: Evading NovaGen",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "dark alley escape Berlin",
    narrative: "After the U-Bahn escape, you ditch your burner phone and find a temporary hideout. Berlin is too hot. You need to get out without attracting more attention.\n\nYour handler advises Prague as the next contact point if you can make it.",
    choices: [
      { text: "Arrange untraceable travel to Prague.", nextSceneId: "prague_travel_untraceable", privacyScoreEffect: 2, feedback: "Smart to go dark. +2 Score." },
      { text: "Risk a commercial flight with a quickly forged ID.", nextSceneId: "prague_travel_immediate_urgent", privacyScoreEffect: -3, feedback: "Risky travel. -3 Score." }
    ]
  },
  'berlin_karlmarxallee_diversion_van': {
    id: 'berlin_karlmarxallee_diversion_van',
    locationTitle: "Berlin: Karl-Marx-Allee - Van Reaction",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "suspicious van street night Karl-Marx-Allee",
    narrative: "You trigger a distant car alarm. The figures in the van barely flinch, their attention fixed on the phone booth.\n\nThis confirms your suspicion: it's a targeted stakeout.",
    choices: [
      { text: "Abort immediately and warn Lynx.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 5, feedback: "Confirmed trap avoided. +5 Score." },
      { text: "Try a more direct diversion closer to the van.", nextSceneId: "berlin_karlmarxallee_direct_diversion", privacyScoreEffect: -2, feedback: "Escalating the risk. -2 Score."}
    ]
  },
  'berlin_karlmarxallee_direct_diversion': {
    id: 'berlin_karlmarxallee_direct_diversion',
    locationTitle: "Berlin: Karl-Marx-Allee - Risky Diversion",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "fire alarm street Karl-Marx-Allee",
    narrative: "You pull a fire alarm in a nearby building. This causes chaos, and the van occupants look agitated, clearly not wanting official attention.\n\nThey pull away from the phone booth, scanning the area.",
    choices: [
      { text: "Use the chaos to attempt the USB retrieval.", nextSceneId: "berlin_karlmarxallee_chaotic_retrieval", privacyScoreEffect: 3, feedback: "Risky but potentially effective. +3 Score." },
      { text: "The area is too hot with potential emergency services. Abort.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: 1, feedback: "Wise to avoid the mess. +1 Score." }
    ]
  },
  'berlin_karlmarxallee_chaotic_retrieval': {
    id: 'berlin_karlmarxallee_chaotic_retrieval',
    locationTitle: "Berlin: Karl-Marx-Allee - Chaos Pickup",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "emergency lights street pickup Karl-Marx-Allee",
    narrative: "Amidst the confusion of the fire alarm, you dash to the phone booth and retrieve the USB.\n\nYou slip away just as the first emergency vehicle arrives. Close call.",
    choices: [
      { text: "Get to your base and analyze the USB.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Successful under pressure! +5 Score."}
    ]
  },
   'berlin_karlmarxallee_call_police': {
    id: 'berlin_karlmarxallee_call_police',
    locationTitle: "Berlin: Karl-Marx-Allee - Police Arrive",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "police car street scene Karl-Marx-Allee",
    narrative: "You anonymously tip off the police about the suspicious van. A patrol car arrives. The van speeds off, but not before the police get its plate.\n\nThe area is now swarming with cops. The dead drop is impossible.",
    choices: [
      { text: "Contact Lynx. Explain the situation. The drop is blown.", nextSceneId: "berlin_contact_lynx_alternative_A", setsFlags: ["failed_usb_A_retrieval"], privacyScoreEffect: -3, feedback: "Unintended consequences, but you're safe. -3 Score." },
      { text: "Try to observe the police interaction with the van from afar.", nextSceneId: "berlin_karlmarxallee_observe_police_van", privacyScoreEffect: -1, feedback: "Risky to linger. -1 Score." }
    ]
  },
  'berlin_karlmarxallee_observe_police_van': {
    id: 'berlin_karlmarxallee_observe_police_van',
    locationTitle: "Berlin: Karl-Marx-Allee - Observing Confrontation",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "police van stop street Karl-Marx-Allee",
    narrative: "You watch from a distance as police pull over the black van. It seems like a routine check, but the occupants look like NovaGen security.\n\nThey are eventually let go. The drop is definitely compromised.",
    choices: [
      { text: "Inform Lynx the drop is hot.", nextSceneId: "berlin_contact_lynx_alternative_A", setsFlags: ["failed_usb_A_retrieval"], privacyScoreEffect: 1, feedback: "Confirmed suspicion. +1 Score." }
    ]
  },
  'berlin_karlmarxallee_direct_police_risk': {
    id: 'berlin_karlmarxallee_direct_police_risk',
    locationTitle: "Berlin: Karl-Marx-Allee - Tense Retrieval",
    image: "https://i.ibb.co/0VCLMx7z/karl-marx-allee-berlin.jpg",
    imageHint: "police presence street retrieval Karl-Marx-Allee",
    narrative: "Despite the risk of police activity, you attempt the retrieval. You manage to get the USB just as a police patrol passes by.\n\nThey eye you suspiciously but move on. Too close for comfort.",
    choices: [
      { text: "Get back to base ASAP to analyze the USB.", nextSceneId: "berlin_analyze_usb_A_securely", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: -5, feedback: "Got it, but took a huge risk. -5 Score."}, 
      { text: "Immediately find a different location to analyze the USB, not your base.", nextSceneId: "berlin_analyze_usb_A_cafe", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: -3, feedback: "Still risky, but avoids leading them to base. -3 Score."}
    ]
  },


  // Shared Berlin Outcomes
  'berlin_contact_lynx_alternative_A': {
    id: 'berlin_contact_lynx_alternative_A',
    locationTitle: "Berlin: Contacting Lynx",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "secure communication laptop",
    narrative: "You use your secure channel to contact Lynx, explaining the original dead drop was compromised or too risky. Lynx responds:\n'Understood. My apologies for the trouble. Berlin is hotter than I thought. New plan: I'm uploading the initial data to an encrypted share. The one-time access key is hidden in a geocache at Teufelsberg (the old listening station). Coordinates will follow on a separate burst transmission. This should be safer for both of us.'",
    choices: [
      { text: "Acknowledge and prepare to go to Teufelsberg.", nextSceneId: "berlin_teufelsberg_prep", privacyScoreEffect: 2, feedback: "New plan. Teufelsberg it is. +2 Score." },
      { text: "Express concern about Teufelsberg's public nature.", nextSceneId: "berlin_teufelsberg_concern", privacyScoreEffect: 0, feedback: "Valid concern, let's see Lynx's response." },
      { text: "Suggest a different, more secure method for the key exchange.", nextSceneId: "berlin_suggest_key_exchange_alt", privacyScoreEffect: 1, feedback: "Proposing alternatives. +1 Score."}
    ]
  },
  'berlin_suggest_key_exchange_alt': {
    id: 'berlin_suggest_key_exchange_alt',
    locationTitle: "Berlin: Negotiating Key Exchange",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "encrypted chat debate",
    narrative: "You suggest an alternative to Lynx for the key exchange, perhaps a one-time pad delivered through a trusted cutout. Lynx considers it but replies:\n'Good idea, but no time to set up a new cutout I trust. Teufelsberg is pre-arranged. The geocache is very discreet, used it before. Please, this is our best shot now.'",
    choices: [
      { text: "Alright, Teufelsberg it is.", nextSceneId: "berlin_teufelsberg_prep", privacyScoreEffect: 1, feedback: "Trusting Lynx's judgment. +1 Score."}
    ]
  },
  'berlin_teufelsberg_prep': {
    id: 'berlin_teufelsberg_prep',
    locationTitle: "Berlin: Preparing for Teufelsberg",
    image: "https://i.ibb.co/4nMgvBXc/teufelsberg-berlin.jpg",
    imageHint: "hiking gear map Teufelsberg",
    narrative: "You receive the coordinates for the Teufelsberg geocache. It's a bit of a hike, and the area is popular with tourists and urban explorers.\n\nHow do you prepare for this retrieval?",
    choices: [
      { text: "Go during off-peak hours, dressed as a hiker.", nextSceneId: "berlin_teufelsberg_hiker_approach", privacyScoreEffect: 3, feedback: "Good planning. +3 Score." },
      { text: "Scout it with a drone first.", nextSceneId: "berlin_teufelsberg_drone_scout", privacyScoreEffect: 5, feedback: "High-tech approach. +5 Score.", requiresFlags: ["has_drone_tech"] },
      { text: "Just go directly, it's a public place.", nextSceneId: "berlin_teufelsberg_direct_approach", privacyScoreEffect: -3, feedback: "Public doesn't always mean safe. -3 Score." }
    ]
  },
   'berlin_teufelsberg_concern': {
    id: 'berlin_teufelsberg_concern',
    locationTitle: "Berlin: Teufelsberg Concerns",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "secure communication concern",
    narrative: "You voice your concerns to Lynx about Teufelsberg. Lynx replies: 'I understand. But it's chaos up there, easier to blend. The key is small, hidden well. Less direct risk than a meet. Please, this data is vital.'",
    choices: [
      { text: "Alright, I'll proceed to Teufelsberg.", nextSceneId: "berlin_teufelsberg_prep", privacyScoreEffect: 1, feedback: "Trusting your source. +1 Score." },
      { text: "Insist on a dead man's switch for the data if I'm caught.", nextSceneId: "berlin_teufelsberg_dead_mans_switch", privacyScoreEffect: 0, feedback: "A grim but practical precaution."}
    ]
  },
  'berlin_teufelsberg_dead_mans_switch': {
    id: 'berlin_teufelsberg_dead_mans_switch',
    locationTitle: "Berlin: Dead Man's Switch",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "encrypted file timer",
    narrative: "Lynx agrees to set up a dead man's switch. If you don't confirm retrieval of the key within a set time, the encrypted share link will be sent to a trusted journalist.\n\nIt's a grim assurance. You now prepare for Teufelsberg.",
    choices: [
      { text: "Proceed to Teufelsberg with the contingency in place.", nextSceneId: "berlin_teufelsberg_prep", setsFlags: ["dead_mans_switch_active"], privacyScoreEffect: 2, feedback: "A morbid safety net, but a safety net. +2 Score."}
    ]
  },
  'berlin_teufelsberg_hiker_approach': {
    id: 'berlin_teufelsberg_hiker_approach',
    locationTitle: "Berlin: Teufelsberg - Hiker",
    image: "https://i.ibb.co/4nMgvBXc/teufelsberg-berlin.jpg",
    imageHint: "Teufelsberg ruins view",
    narrative: "Dressed as a hiker, you blend in easily at Teufelsberg. You locate the geocache – a small, weatherproof container.\n\nInside, a tiny USB stick with the access key.",
    choices: [
      { text: "Retrieve the key and head back to base to access the share.", nextSceneId: "berlin_analyze_encrypted_share", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Successful retrieval! +5 Score."}
    ]
  },
  'berlin_teufelsberg_drone_scout': {
    id: 'berlin_teufelsberg_drone_scout',
    locationTitle: "Berlin: Teufelsberg - Drone Recon",
    image: "https://i.ibb.co/4nMgvBXc/teufelsberg-berlin.jpg",
    imageHint: "drone view Teufelsberg landscape",
    narrative: "Your drone buzzes over Teufelsberg, mapping the area and the geocache location. No obvious surveillance.\n\nYou guide the drone to a discreet spot, then retrieve the cache yourself. It contains the USB access key.",
    choices: [
      { text: "Key obtained. Return to base to access the encrypted share.", nextSceneId: "berlin_analyze_encrypted_share", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 5, feedback: "Excellent use of tech! +5 Score."}
    ],
    requiresFlags: ["has_drone_tech"]
  },
  'berlin_teufelsberg_direct_approach': {
    id: 'berlin_teufelsberg_direct_approach',
    locationTitle: "Berlin: Teufelsberg - Direct",
    image: "https://i.ibb.co/4nMgvBXc/teufelsberg-berlin.jpg",
    imageHint: "Teufelsberg geocache find",
    narrative: "You head directly to the geocache. It's a popular spot. As you retrieve the USB key, you notice someone watching you from the radar domes.\n\nThey quickly look away when you meet their gaze.",
    choices: [
      { text: "Assume it's nothing, get the key, and leave.", nextSceneId: "berlin_analyze_encrypted_share", setsFlags: ["usb_A_retrieved", "possibly_seen_teufelsberg"], privacyScoreEffect: 0, feedback: "Got the key, but might have been seen." },
      { text: "Confront the watcher.", nextSceneId: "berlin_teufelsberg_confront_watcher", privacyScoreEffect: -5, feedback: "Confrontation is risky. -5 Score."}, 
      { text: "Discreetly take a photo of the watcher before leaving.", nextSceneId: "berlin_teufelsberg_photo_watcher", setsFlags: ["usb_A_retrieved", "photo_of_watcher"], privacyScoreEffect: 1, feedback: "Gathering potential intel. +1 Score."}
    ]
  },
  'berlin_teufelsberg_photo_watcher': {
    id: 'berlin_teufelsberg_photo_watcher',
    locationTitle: "Berlin: Teufelsberg - Watcher Photographed",
    image: "https://i.ibb.co/4nMgvBXc/teufelsberg-berlin.jpg",
    imageHint: "camera phone spy photo Teufelsberg",
    narrative: "You manage to snap a covert photo of the watcher as you retrieve the USB key and leave. This might be useful later.\n\nTime to access the encrypted share.",
    choices: [
      { text: "Return to base to access the share and analyze the photo.", nextSceneId: "berlin_analyze_encrypted_share", setsFlags: ["usb_A_retrieved"], privacyScoreEffect: 3, feedback: "Good initiative. +3 Score."}
    ]
  },
  'berlin_teufelsberg_confront_watcher': {
    id: 'berlin_teufelsberg_confront_watcher',
    locationTitle: "Berlin: Teufelsberg - Confrontation",
    image: "https://i.ibb.co/4nMgvBXc/teufelsberg-berlin.jpg",
    imageHint: "Teufelsberg tense encounter",
    narrative: "You approach the individual. They claim to be an urban photographer but seem nervous and quickly pack up, leaving in a hurry.\n\nYou get the feeling they weren't just taking pictures.",
    choices: [
      { text: "You have the key. Best to leave and analyze the share.", nextSceneId: "berlin_analyze_encrypted_share", setsFlags: ["usb_A_retrieved", "alerted_watcher_teufelsberg"], privacyScoreEffect: -2, feedback: "You alerted someone. -2 Score."}
    ]
  },
  'berlin_analyze_usb_A_securely': {
    id: 'berlin_analyze_usb_A_securely',
    locationTitle: "Berlin: Home Base - Analyzing USB A",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "laptop data analysis secure",
    narrative: "Back at your secure base in Berlin, you plug in USB A. It contains encrypted files. After some work, you decrypt them: partial patient records from NovaGen trials, and a new message from Lynx:\n'URGENT! They know about Berlin. Moving to Prague. New drop: Old Town kiosk. My comms are compromised. BE CAREFUL. - Lynx'.\n\nThis changes everything.",
    choices: [
      { text: "Leave for Prague immediately, securing travel documents digitally.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: 3, feedback: "Fast action, but digital docs have risks. +3 Score." },
      { text: "Prepare more thoroughly: arrange physical false papers before Prague.", nextSceneId: "prague_travel_false_papers", privacyScoreEffect: 5, feedback: "False papers offer better protection. +5 Score." },
      { text: "Attempt to fully decrypt the schematics before leaving.", nextSceneId: "berlin_decrypt_more_A_before_prague", privacyScoreEffect: -2, feedback: "Delaying could be risky. -2 Score." }
    ]
  },
  'berlin_analyze_usb_A_securely_risky': {
    id: 'berlin_analyze_usb_A_securely_risky',
    locationTitle: "Berlin: Home Base - Risky Analysis",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "tense data analysis sirens",
    narrative: "Despite knowing your Berlin identity might be compromised, you risk returning to your base to analyze USB A. You quickly decrypt it: partial patient records, and Lynx's urgent message:\n'URGENT! They know about Berlin. Moving to Prague. New drop: Old Town kiosk. My comms are compromised. BE CAREFUL. - Lynx'.\n\nYou hear sirens approaching outside.",
    choices: [
      { text: "Grab the data and make an emergency exit to Prague NOW.", nextSceneId: "prague_travel_immediate_urgent", privacyScoreEffect: -5, feedback: "Narrow escape! -5 Score." }
    ]
  },
  'berlin_analyze_usb_A_burner_cloud': {
    id: 'berlin_analyze_usb_A_burner_cloud',
    locationTitle: "Berlin: Analyzing USB A via Cloud",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "phone cloud sync data",
    narrative: "Using your burner phone and a supposedly secure cloud service, you access USB A. The files are there: partial patient records and Lynx's urgent message:\n'URGENT! They know about Berlin. Moving to Prague. New drop: Old Town kiosk. My comms are compromised. BE CAREFUL. - Lynx'.\n\nYou hope the cloud service was truly private.",
    choices: [
      { text: "Wipe cloud data and head to Prague.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: 1, feedback: "Cloud use is a metadata risk. +1 Score." },
      { text: "Keep cloud copy as backup, head to Prague.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: -2, feedback: "Leaving data on cloud is risky. -2 Score.", setsFlags: ["cloud_backup_risk"] },
      { text: "Verify cloud service security logs before proceeding.", nextSceneId: "berlin_verify_cloud_security", privacyScoreEffect: 3, feedback: "Good diligence. +3 Score."}
    ]
  },
  'berlin_verify_cloud_security': {
    id: 'berlin_verify_cloud_security',
    locationTitle: "Berlin: Cloud Security Check",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "security logs cloud server",
    narrative: "You take the time to check the security logs of your cloud service provider. No unauthorized access attempts detected. It seems secure for now.\n\nLynx's message urges you to Prague.",
    choices: [
      { text: "Wipe local copies and head to Prague, relying on the secure cloud.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: 2, feedback: "Secure cloud is good, but reliance has risks. +2 Score." },
      { text: "Download a local encrypted copy, wipe cloud, then head to Prague.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: 5, feedback: "Best practice for data control. +5 Score." }
    ]
  },
  'berlin_analyze_usb_A_cafe': {
    id: 'berlin_analyze_usb_A_cafe',
    locationTitle: "Berlin: Internet Cafe - High Risk Analysis",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "internet cafe computer screen",
    narrative: "You risk using an internet cafe computer. The machine is slow, likely riddled with spyware. You manage to view USB A: partial records, and Lynx's urgent Prague message.\n\nAs you log off, the cafe owner eyes your USB stick with interest.",
    choices: [
      { text: "Leave immediately for Prague, hoping the USB wasn't copied.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: -5, feedback: "Extreme risk taken. Data might be compromised. -5 Score.", setsFlags: ["cafe_usb_compromised"] }, 
      { text: "Wipe the cafe computer (if possible) and then leave for Prague.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: -5, feedback: "Attempting to clean up is good, but still risky. -5 Score.", setsFlags: ["cafe_usb_compromised"] }, 
      { text: "Offer the cafe owner money for their discretion.", nextSceneId: "berlin_cafe_bribe_owner", privacyScoreEffect: -3, feedback: "Risky, could make you memorable. -3 Score." }
    ]
  },
  'berlin_cafe_bribe_owner': {
    id: 'berlin_cafe_bribe_owner',
    locationTitle: "Berlin: Cafe Owner Payoff",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "cash exchange cafe counter",
    narrative: "You slip the cafe owner a hefty sum. They pocket it with a nod. 'Never saw a thing.' It's a temporary fix, but you've likely bought some silence.\n\nLynx's message points to Prague.",
    choices: [
      { text: "Head to Prague immediately.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: -2, feedback: "Bribery can have unforeseen consequences. -2 Score." }
    ]
  },
  'berlin_analyze_encrypted_share': {
    id: 'berlin_analyze_encrypted_share',
    locationTitle: "Berlin: Home Base - Encrypted Share",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "laptop secure server access",
    narrative: "Back at base, you use the USB key to access Lynx's encrypted share. It works! Inside: partial patient records, research notes, and a new audio message from Lynx:\n'They're definitely on to me. Berlin is burned. I'm heading to Prague. Old Town kiosk, near the clock, 3 PM tomorrow. This is critical. Bring any further data you have. My usual comms are shot. Be careful. - Lynx'.",
    choices: [
      { text: "Leave for Prague immediately, secure digital travel docs.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: 3, feedback: "Fast action. +3 Score." },
      { text: "Prepare false papers before Prague.", nextSceneId: "prague_travel_false_papers", privacyScoreEffect: 5, feedback: "Safer travel. +5 Score." },
      { text: "Try to find more data in Berlin before meeting Lynx.", nextSceneId: "berlin_last_ditch_berlin_intel", privacyScoreEffect: -3, feedback: "Ignoring Lynx's urgency is risky. -3 Score." }
    ]
  },
  'berlin_last_ditch_berlin_intel': {
    id: 'berlin_last_ditch_berlin_intel',
    locationTitle: "Berlin: One Last Search",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "ransacked office Berlin night",
    narrative: "Ignoring Lynx's urgency, you spend a few more hours trying to dig up extra intel in Berlin. You find nothing new and waste precious time. NovaGen's surveillance in Berlin is tightening.\n\nYou hear activity outside your base.",
    choices: [
      { text: "Emergency exfiltration to Prague now!", nextSceneId: "prague_travel_immediate_urgent", privacyScoreEffect: -5, feedback: "Delayed too long, narrow escape. -5 Score." }, 
      { text: "Barricade and prepare for a confrontation.", nextSceneId: "gameOver_lose_caught_early", privacyScoreEffect: -20, gameOverMessage: "You waited too long. NovaGen forces surrounded your Berlin base. Mission failed."}
    ]
  },
  'berlin_decrypt_more_A_before_prague': {
    id: 'berlin_decrypt_more_A_before_prague',
    locationTitle: "Berlin: Decrypting More Intel",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "data decryption screen late night",
    narrative: "You spend precious hours trying to further decrypt the files from USB A. You uncover a few more damning internal memos, but Lynx's warning about Prague and compromised comms weighs heavily.\n\nTime is running out.",
    choices: [
      { text: "With this extra intel, head to Prague now.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: 0, feedback: "Extra intel, but lost time. Net 0 score." },
      { text: "The delay was too long. NovaGen operatives raid your safe house!", nextSceneId: "gameOver_lose_caught_early", privacyScoreEffect: -20, gameOverMessage: "You delayed too long in Berlin. NovaGen tracked you down. Mission Failed."},
      { text: "Quickly wipe all data and attempt to surrender peacefully.", nextSceneId: "berlin_surrender_attempt", privacyScoreEffect: -5, feedback: "Surrender is a last resort. -5 Score."} 
    ]
  },
  'berlin_surrender_attempt': {
    id: 'berlin_surrender_attempt',
    locationTitle: "Berlin: Attempting Surrender",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "hands up dark room",
    narrative: "As NovaGen forces breach your door, you initiate a full data wipe and raise your hands. 'I'll come peacefully.'\n\nThey seem surprised but still take you into custody. The mission is over, but at least the data is gone.",
    choices: [
      { text: "The end.", nextSceneId: "gameOver_lose_caught_early", gameOverMessage: "You were captured, but your data wipe prevented NovaGen from recovering your intel. A small victory in a larger defeat.", privacyScoreEffect: -10 }
    ]
  },
  'berlin_lay_low_compromised': {
    id: 'berlin_lay_low_compromised',
    locationTitle: "Berlin: Laying Low",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "hidden apartment room",
    narrative: "You find a new, obscure place to lay low in Berlin. Your previous identity is useless. You manage to analyze USB A. It has some data and Lynx's urgent message:\n'Berlin compromised. Moving to Prague. Old Town kiosk. My comms are shot. BE CAREFUL. - Lynx'.\n\nGetting to Prague will be harder now.",
    choices: [
      { text: "Attempt to arrange discreet, untraceable travel to Prague.", nextSceneId: "prague_travel_untraceable", privacyScoreEffect: 5, feedback: "Difficult but necessary. +5 Score."},
      { text: "Try to re-establish secure comms with Lynx from new hideout (risky).", nextSceneId: "berlin_contact_lynx_new_hideout", privacyScoreEffect: -5, feedback: "Risky, Lynx's comms are bad. -5 Score."},
      { text: "Seek help from a local underground contact for extraction.", nextSceneId: "berlin_underground_extraction", privacyScoreEffect: 0, feedback: "Relying on others has its own risks."}
    ]
  },
  'berlin_underground_extraction': {
    id: 'berlin_underground_extraction',
    locationTitle: "Berlin: Underground Help",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "shady contact meeting Berlin",
    narrative: "You reach out to an old underground contact in Berlin. For a price (a future favor), they agree to help smuggle you to Prague.\n\nIt's a tense journey, hidden in a cargo truck, but you make it.",
    choices: [
      { text: "Arrived in Prague. Now to find Lynx.", nextSceneId: "prague_arrival_untraceable", privacyScoreEffect: 3, feedback: "Made it, but owe a favor. +3 Score.", setsFlags: ["owe_underground_favor_berlin"]}
    ]
  },
  'prague_arrival_untraceable': { 
    id: 'prague_arrival_untraceable',
    locationTitle: "Prague: Covert Arrival",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech-republic.jpg",
    imageHint: "Prague dark alley arrival",
    narrative: "You arrive in Prague via unconventional means, your Berlin identity thoroughly burned.\n\nYou need to find Lynx at the Old Town kiosk.",
    choices: [
      { text: "Scout the Old Town kiosk area.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 5},
      { text: "Try to find a new burner phone first.", nextSceneId: "prague_setup_comms_B", privacyScoreEffect: 3},
    ]
  },
   'berlin_contact_lynx_new_hideout': {
    id: 'berlin_contact_lynx_new_hideout',
    locationTitle: "Berlin: Risky Comms Attempt",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "laptop error message",
    narrative: "You try to contact Lynx. The message bounces. His channels are indeed dead or heavily monitored.\n\nWasted effort, and you might have tipped off NovaGen to your continued presence.",
    choices: [
      { text: "Focus on getting to Prague untraced.", nextSceneId: "prague_travel_untraceable", privacyScoreEffect: 0 },
      { text: "Attempt a risky public data drop for Lynx, hoping he finds it.", nextSceneId: "berlin_public_data_drop_attempt", privacyScoreEffect: -3, feedback: "High risk, low chance of success. -3 Score."}
    ]
  },
  'berlin_public_data_drop_attempt': {
    id: 'berlin_public_data_drop_attempt',
    locationTitle: "Berlin: Public Data Drop",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "USB hidden public library",
    narrative: "You leave a copy of the USB A data in a pre-arranged public library book, hoping Lynx has a way to check for it. It's a long shot.\n\nYou then focus on leaving Berlin.",
    choices: [
      { text: "Proceed to Prague, hoping Lynx got the message.", nextSceneId: "prague_travel_untraceable", privacyScoreEffect: -2, feedback: "Uncertain outcome. -2 Score."}
    ]
  },
  'berlin_lose_usb_A': {
    id: 'berlin_lose_usb_A',
    locationTitle: "Berlin: Evidence Lost",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "dejected detective office",
    narrative: "You dropped USB A to avoid capture. The initial intel is gone. You manage to get away, but it's a serious blow.\n\nYou need to contact Lynx and explain.",
    choices: [
      { text: "Use secure comms to update Lynx on the failure.", nextSceneId: "berlin_contact_lynx_alternative_A", privacyScoreEffect: -5, feedback: "Lost evidence is bad. -5 Score." }, 
      { text: "Try to find Lynx directly, abandoning comms.", nextSceneId: "berlin_find_lynx_directly", privacyScoreEffect: -5, feedback: "Risky without knowing Lynx's status. -5 Score." } 
    ]
  },
  'berlin_find_lynx_directly': {
    id: 'berlin_find_lynx_directly',
    locationTitle: "Berlin: Desperate Search for Lynx",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "Berlin street map search",
    narrative: "Abandoning secure comms, you try to use old contact methods or known hangouts to find Lynx directly. After a frustrating day, you find a coded message at a previously discussed emergency spot:\n'Too hot. Prague. Old Town kiosk. Be careful.'",
    choices: [
      { text: "Finally, a lead. Head to Prague.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: 0, feedback: "Wasted time, but re-established contact."}
    ]
  },


  // --- PRAGUE (City B) ---
  'prague_travel_immediate': {
    id: 'prague_travel_immediate',
    locationTitle: "Travel to Prague",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech-republic.jpg",
    imageHint: "Prague airport departure board",
    narrative: "You quickly arrange travel to Prague using digitally secured documents. The journey is tense, every airport scanner and customs agent a potential threat.\n\nYou arrive in Prague with Lynx's message about the Old Town kiosk meet-up fresh in your mind.",
    choices: [
      { text: "Proceed to Old Town Square to scout before meet time.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 5, feedback: "Scouting is always wise. +5 Score." },
      { text: "Find a secure cafe nearby to check for last-minute updates from Lynx (if possible).", nextSceneId: "prague_cafe_comms_check", privacyScoreEffect: 2, feedback: "Cautious comms check. +2 Score." },
      { text: "Go directly to the Old Town kiosk at meet time.", nextSceneId: "prague_oldtown_direct_meet", privacyScoreEffect: -5, feedback: "Direct meeting is risky. -5 Score." }
    ]
  },
  'prague_travel_immediate_urgent': {
    id: 'prague_travel_immediate_urgent',
    locationTitle: "Urgent Travel to Prague",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech-republic.jpg",
    imageHint: "Prague train station night",
    narrative: "Fleeing Berlin, you make a hasty, covert journey to Prague. You managed to evade immediate capture, but NovaGen is undoubtedly alerted.\n\nYou recall Lynx's message about Old Town kiosk.",
    choices: [
      { text: "Proceed to Old Town kiosk, attempting to detect surveillance.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 3, feedback: "Extra caution needed. +3 Score." },
      { text: "Find a very discrete way to check for updates before the meet.", nextSceneId: "prague_cafe_comms_check_covert", privacyScoreEffect: 1, feedback: "Low profile comms. +1 Score." },
      { text: "Set up a counter-surveillance position before going near the kiosk.", nextSceneId: "prague_setup_counter_surveillance_kiosk", privacyScoreEffect: 2, feedback: "Proactive, but takes time. +2 Score."}
    ]
  },
  'prague_setup_counter_surveillance_kiosk': {
    id: 'prague_setup_counter_surveillance_kiosk',
    locationTitle: "Prague: Kiosk Counter-Surveillance",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague rooftop surveillance",
    narrative: "You find a high vantage point overlooking the Old Town kiosk and set up discreet surveillance. You observe the area for an hour before the meet time.\n\nNothing overtly suspicious, but the area is crowded.",
    choices: [
      { text: "Proceed to the meet, confident it's relatively clear.", nextSceneId: "prague_oldtown_direct_meet", privacyScoreEffect: 1, feedback: "Observation helps, but crowds hide threats. +1 Score."},
      { text: "It's too crowded to be sure. Try to signal Lynx to abort/delay.", nextSceneId: "prague_signal_lynx_abort", privacyScoreEffect: 2, feedback: "Caution is good. +2 Score."}
    ]
  },
  'prague_travel_false_papers': {
    id: 'prague_travel_false_papers',
    locationTitle: "Travel to Prague - False Identity",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech-republic.jpg",
    imageHint: "Prague passport control",
    narrative: "Your false papers are convincing. Travel to Prague is uneventful. You arrive with time to spare before the meet with Lynx at the Old Town kiosk.\n\nYour new identity feels secure for now.",
    choices: [
      { text: "Scout Old Town kiosk thoroughly.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 5, feedback: "Excellent OPSEC. +5 Score." },
      { text: "Establish a temporary secure comms point near the square.", nextSceneId: "prague_setup_comms_B", privacyScoreEffect: 3, feedback: "Good foresight. +3 Score." }, 
      { text: "Relax at a cafe and observe general patterns before heading over.", nextSceneId: "prague_cafe_observe", privacyScoreEffect: 1, feedback: "Casual observation. +1 Score." }
    ]
  },
  'prague_travel_untraceable': {
    id: 'prague_travel_untraceable',
    locationTitle: "Covert Travel to Prague",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech_republic.jpg",
    imageHint: "Prague cargo ship night",
    narrative: "After your Berlin identity was compromised, getting to Prague required unconventional, untraceable methods. It was slow and uncomfortable, but you've arrived.\n\nLynx's message mentioned Old Town kiosk.",
    choices: [
      { text: "Scout Old Town kiosk with extreme prejudice.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 5, feedback: "Max security approach. +5 Score." },
      { text: "Your priority is new, clean comms before anything else.", nextSceneId: "prague_setup_comms_B", privacyScoreEffect: 4, feedback: "Essential after being compromised. +4 Score." }, 
      { text: "Find a local disguise before approaching the area.", nextSceneId: "prague_kiosk_disguise", privacyScoreEffect: 2, feedback: "Blending in can help. +2 Score."}
    ]
  },
  'prague_kiosk_disguise': {
    id: 'prague_kiosk_disguise',
    locationTitle: "Prague: Kiosk Disguise",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague tourist disguise",
    narrative: "You acquire a local-style hat and jacket, blending in as a tourist.\n\nYou feel slightly more confident approaching the Old Town kiosk.",
    choices: [
      { text: "Scout the Old Town kiosk area now.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 3, feedback: "Disguise helps scouting. +3 Score."},
      { text: "Go directly to the meet, relying on the disguise.", nextSceneId: "prague_oldtown_direct_meet", privacyScoreEffect: -2, feedback: "Disguise isn't foolproof. -2 Score."}
    ]
  },
  'prague_oldtown_scout': {
    id: 'prague_oldtown_scout',
    locationTitle: "Prague: Old Town Square Recon",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague Old Town Square surveillance",
    narrative: "You scout Old Town Square. It's crowded. You spot a few individuals who don't fit the tourist profile, paying too much attention to the area around the kiosk.\n\nPotential NovaGen watchers.",
    choices: [
      { text: "Attempt the meet but have an escape route planned.", nextSceneId: "prague_oldtown_meet_watched", privacyScoreEffect: -3, feedback: "Risky, but you're prepared. -3 Score." },
      { text: "Try to signal Lynx discreetly that the area is hot.", nextSceneId: "prague_signal_lynx_abort", privacyScoreEffect: 2, feedback: "Protecting your source. +2 Score." },
      { text: "Create a diversion to pull watchers away from the kiosk.", nextSceneId: "prague_oldtown_diversion", privacyScoreEffect: 0, feedback: "Could work, or escalate things." }
    ]
  },
  'prague_cafe_comms_check': {
    id: 'prague_cafe_comms_check',
    locationTitle: "Prague: Cafe Comms Check",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech_republic.jpg",
    imageHint: "Prague cafe laptop",
    narrative: "You find a quiet cafe with decent Wi-Fi. Using a VPN and your secure messaging app, you check for updates.\n\nNothing new from Lynx. The meet at Old Town kiosk is still on.",
    choices: [
      { text: "Head to Old Town Square and scout before meet time.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 5 },
      { text: "Go directly to the Old Town kiosk at meet time.", nextSceneId: "prague_oldtown_direct_meet", privacyScoreEffect: -5 },
      { text: "Send a 'check-in' message to Lynx to confirm meet.", nextSceneId: "prague_lynx_confirm_meet", privacyScoreEffect: 1, feedback: "Confirming details. +1 Score." }
    ]
  },
  'prague_lynx_confirm_meet': {
    id: 'prague_lynx_confirm_meet',
    locationTitle: "Prague: Confirming with Lynx",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "encrypted message phone Prague",
    narrative: "You send a quick, coded 'all-clear?' message to Lynx. Lynx replies:\n'Affirmative. See you at the kiosk. Caution advised.'",
    choices: [
      { text: "Proceed to scout Old Town Square.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 3, feedback: "Confirmation received. Scouting still wise. +3 Score."},
      { text: "Go directly to meet Lynx.", nextSceneId: "prague_oldtown_direct_meet", privacyScoreEffect: -2, feedback: "Direct meet, even with confirmation, has risks. -2 Score."}
    ]
  },
  'prague_cafe_comms_check_covert': {
    id: 'prague_cafe_comms_check_covert',
    locationTitle: "Prague: Covert Comms",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech_republic.jpg",
    imageHint: "Prague alleyway burner phone",
    narrative: "You use a series of public relays and your burner to check for messages. It's slow, but secure.\n\nNo new messages from Lynx. The Old Town kiosk meet is still the plan.",
    choices: [
       { text: "Proceed to scout Old Town Square.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 5 },
       { text: "Try a 'digital dead drop' reply to Lynx to verify channel.", nextSceneId: "prague_digital_dead_drop_test", privacyScoreEffect: 2, feedback: "Testing comms security. +2 Score."}
    ]
  },
  'prague_digital_dead_drop_test': {
    id: 'prague_digital_dead_drop_test',
    locationTitle: "Prague: Digital Dead Drop Test",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech_republic.jpg",
    imageHint: "encrypted file transfer secure",
    narrative: "You send a tiny, heavily encrypted, innocuous file to Lynx via a one-time share, asking for a simple acknowledgment if received. Lynx acknowledges.\n\nThe channel seems secure enough for now. The Old Town kiosk meet is on.",
    choices: [
      { text: "Scout the Old Town kiosk area.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 3, feedback: "Channel tested. +3 Score." }
    ]
  },
  'prague_setup_comms_B': { 
    id: 'prague_setup_comms_B',
    locationTitle: "Prague: Secure Comms Point",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech_republic.jpg",
    imageHint: "Prague temporary office setup",
    narrative: "You establish a temporary, secure comms point in a rented room near Old Town Square, complete with a new burner SIM and VPN.\n\nYou're ready for any updates from Lynx.",
    choices: [
      { text: "Now, scout Old Town Square before the meet.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 5 },
      { text: "Use new comms to research the Old Town kiosk for known surveillance spots.", nextSceneId: "prague_research_kiosk_surveillance", privacyScoreEffect: 3, feedback: "Good use of new comms. +3 Score." }
    ]
  },
  'prague_research_kiosk_surveillance': {
    id: 'prague_research_kiosk_surveillance',
    locationTitle: "Prague: Kiosk Surveillance Research",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague map security cameras",
    narrative: "Your research reveals several public and private security cameras with views of the Old Town kiosk. It's a well-monitored area, though not necessarily by NovaGen specifically.\n\nHigh vigilance required for the meet.",
    choices: [
      { text: "Proceed to scout the area, aware of camera placements.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 2, feedback: "Intel helps focus scouting. +2 Score." }
    ]
  },
  'prague_cafe_observe': {
    id: 'prague_cafe_observe',
    locationTitle: "Prague: Cafe Observation",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague cafe window view square",
    narrative: "From a cafe with a view of Old Town Square, you observe the crowds. Nothing immediately suspicious, but it's hard to be sure from a distance.\n\nThe clock is ticking towards meet time.",
    choices: [
      { text: "Time to scout the square up close.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 3 },
      { text: "Risk the direct meet at the kiosk.", nextSceneId: "prague_oldtown_direct_meet", privacyScoreEffect: -5 },
      { text: "Send a decoy (e.g., a courier with a harmless note for 'Lynx') to test reactions.", nextSceneId: "prague_send_decoy_kiosk", privacyScoreEffect: 0, feedback: "Could reveal surveillance, or waste time." }
    ]
  },
  'prague_send_decoy_kiosk': {
    id: 'prague_send_decoy_kiosk',
    locationTitle: "Prague: Kiosk Decoy",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague courier delivery square",
    narrative: "You hire a local courier to deliver a generic tourist map to 'a contact named Lynx' at the kiosk. You watch from the cafe.\n\nNo one reacts unusually to the courier. It seems clear, or the surveillance is very subtle.",
    choices: [
      { text: "Seems okay. Proceed to scout the kiosk area yourself.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 2, feedback: "Decoy didn't trigger alarms. +2 Score." },
      { text: "The lack of reaction is suspicious. Abort and contact Lynx.", nextSceneId: "prague_contact_lynx_alternative_B", privacyScoreEffect: 1, feedback: "Better safe than sorry. +1 Score." }
    ]
  },
  'prague_oldtown_direct_meet': {
    id: 'prague_oldtown_direct_meet',
    locationTitle: "Prague: Old Town - Direct Meet",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague Old Town Square meeting",
    narrative: "At the designated time, you're by the Old Town kiosk. A figure approaches – it's Lynx, looking nervous. 'Quickly,' Lynx says, 'They might be onto this. I have the main drive. Password is 'OrionPax'. Take it. Head to Amsterdam. My contact there, 'Oracle', can help you decrypt the final layers. I'll try to create a diversion.'\n\nLynx hands you a small, encrypted hard drive.",
    choices: [
      { text: "Thank Lynx, take the drive, and get to Amsterdam ASAP.", nextSceneId: "amsterdam_travel_direct", setsFlags: ["critical_evidence_obtained_prague"], privacyScoreEffect: 5, feedback: "You have the critical evidence! +5 Score." },
      { text: "Insist Lynx come with you to Amsterdam for safety.", nextSceneId: "prague_lynx_escort_attempt", privacyScoreEffect: 0, feedback: "A noble gesture, but Lynx has plans." },
      { text: "Ask Lynx for more details about 'Oracle' before leaving.", nextSceneId: "prague_ask_about_oracle", privacyScoreEffect: 2, feedback: "Gathering more intel. +2 Score." }
    ]
  },
  'prague_oldtown_meet_watched': {
    id: 'prague_oldtown_meet_watched',
    locationTitle: "Prague: Old Town - Watched Meet",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague tense meeting square surveillance",
    narrative: "You proceed with the meet. Lynx arrives, tense. 'They're here. I can feel it.'\n\nLynx quickly hands you an encrypted drive. 'Password 'OrionPax'. Amsterdam. Oracle. Go!' Just then, the watchers you spotted start closing in.",
    choices: [
      { text: "Create a diversion for Lynx and escape with the drive.", nextSceneId: "amsterdam_travel_direct_escape", setsFlags: ["critical_evidence_obtained_prague"], privacyScoreEffect: 3, feedback: "Got the drive, hectic escape. +3 Score." },
      { text: "Focus on your own escape, hoping Lynx gets away.", nextSceneId: "amsterdam_travel_direct_escape", setsFlags: ["critical_evidence_obtained_prague", "lynx_possibly_compromised_prague"], privacyScoreEffect: -5, feedback: "You escaped, but Lynx is in danger. -5 Score." },
      { text: "Engage the watchers to buy Lynx time.", nextSceneId: "gameOver_lose_lynx_compromised", privacyScoreEffect: -15, gameOverMessage: "You fought to protect Lynx, but NovaGen overwhelmed you both. Lynx is captured. Mission failed." }
    ]
  },
  'prague_signal_lynx_abort': {
    id: 'prague_signal_lynx_abort',
    locationTitle: "Prague: Old Town - Abort Signal",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague discreet signal square crowds",
    narrative: "You use a pre-arranged subtle signal (e.g., holding a red newspaper) to indicate danger. Lynx, approaching from a distance, sees it and subtly changes direction, disappearing into an alley.\n\nThe meet is off, but Lynx is safe for now. Later, you get a burst message: 'Good call. Too hot. New plan: Amsterdam, rendezvous at Cafe De Jaren, ask for 'Oracle'. I've sent the package ahead there through a secure courier. Password 'OrionPax'.'",
    choices: [
      { text: "Acknowledge and prepare for Amsterdam.", nextSceneId: "amsterdam_travel_direct", privacyScoreEffect: 5, feedback: "Excellent awareness, source protected. +5 Score." },
      { text: "Suggest alternative secure comms before Amsterdam.", nextSceneId: "prague_suggest_alt_comms_B", privacyScoreEffect: 1, feedback: "Exploring options. +1 Score." }
    ]
  },
  'prague_suggest_alt_comms_B': {
    id: 'prague_suggest_alt_comms_B',
    locationTitle: "Prague: Alternative Comms Suggestion",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech_republic.jpg",
    imageHint: "encrypted message planning",
    narrative: "You suggest to Lynx setting up a more robust encrypted communication channel before heading to Amsterdam. Lynx replies: 'No time. My current setup is too exposed for prolonged use. The courier to Oracle is reliable. Amsterdam is the best bet. Trust me on this.'",
    choices: [
      { text: "Understood. Prepare for Amsterdam.", nextSceneId: "amsterdam_travel_direct", privacyScoreEffect: 1, feedback: "Trusting Lynx's assessment. +1 Score." }
    ]
  },
  'prague_oldtown_diversion': {
    id: 'prague_oldtown_diversion',
    locationTitle: "Prague: Old Town - Diversion",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague street performance square distraction",
    narrative: "You pay a street performer to cause a sudden, loud spectacle away from the kiosk. It works! The watchers are distracted.\n\nLynx uses the opportunity to approach you. 'Clever,' Lynx says, handing you the drive. 'OrionPax. Amsterdam. Oracle. Now go!'",
    choices: [
      { text: "Take drive, head to Amsterdam.", nextSceneId: "amsterdam_travel_direct", setsFlags: ["critical_evidence_obtained_prague"], privacyScoreEffect: 5, feedback: "Well-executed diversion! +5 Score." },
      { text: "Ensure Lynx has a clear escape route before you leave.", nextSceneId: "prague_ensure_lynx_escape", setsFlags: ["critical_evidence_obtained_prague"], privacyScoreEffect: 3, feedback: "Looking out for your source. +3 Score." }
    ]
  },
  'prague_ensure_lynx_escape': {
    id: 'prague_ensure_lynx_escape',
    locationTitle: "Prague: Covering Lynx's Retreat",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague alley escape quick",
    narrative: "You subtly create a secondary, minor disturbance as Lynx slips away, ensuring any remaining attention is on you. Lynx gets clear.\n\nYou then make your own exit with the drive. Time for Amsterdam.",
    choices: [
      { text: "Proceed to Amsterdam.", nextSceneId: "amsterdam_travel_direct", privacyScoreEffect: 5, feedback: "Excellent teamwork and OPSEC. +5 Score."}
    ]
  },
  'prague_lynx_escort_attempt': {
    id: 'prague_lynx_escort_attempt',
    locationTitle: "Prague: Old Town - Lynx's Plan",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague farewell square tense",
    narrative: "You urge Lynx to come with you. Lynx shakes their head. 'No, I draw too much heat. I have my own ways. Get the data out. Expose them. That's all that matters. Amsterdam. Oracle. Go!'\n\nLynx then creates a small diversion and slips away.",
    choices: [
      { text: "Respect Lynx's decision. Head to Amsterdam with the drive.", nextSceneId: "amsterdam_travel_direct", setsFlags: ["critical_evidence_obtained_prague"], privacyScoreEffect: 5, feedback: "You have the drive. +5 Score." },
      { text: "Offer Lynx your burner phone for safer comms.", nextSceneId: "prague_offer_lynx_burner", setsFlags: ["critical_evidence_obtained_prague"], privacyScoreEffect: 2, feedback: "Helping Lynx's security. +2 Score."}
    ]
  },
  'prague_offer_lynx_burner': {
    id: 'prague_offer_lynx_burner',
    locationTitle: "Prague: Assisting Lynx",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "burner phone exchange Prague",
    narrative: "You quickly pass your burner phone to Lynx. 'For emergencies. Stay safe.' Lynx nods, grateful. 'You too. Now go.'\n\nYou separate, both heading towards uncertain futures, but you have the drive for Amsterdam.",
    choices: [
      { text: "Head to Amsterdam.", nextSceneId: "amsterdam_travel_direct", privacyScoreEffect: 3, feedback: "A compassionate and smart move. +3 Score." }
    ]
  },
  'prague_ask_about_oracle': {
    id: 'prague_ask_about_oracle',
    locationTitle: "Prague: Old Town - Oracle Info",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague whispered conversation square detail",
    narrative: "You ask Lynx about Oracle. 'Old friend. Tech wizard. Deeply trusted. You'll find them at Cafe De Jaren in Amsterdam. Mention my name and 'Silent Sparrow' if they're wary. Now, you must go!'\n\nLynx hands you the drive, password 'OrionPax'.",
    choices: [
      { text: "Got it. Head to Amsterdam.", nextSceneId: "amsterdam_travel_direct", setsFlags: ["critical_evidence_obtained_prague", "knows_about_oracle"], privacyScoreEffect: 5, feedback: "More intel, better prepared. +5 Score." },
      { text: "Ask for a secondary contact in case Oracle is unavailable.", nextSceneId: "prague_ask_secondary_contact", setsFlags: ["critical_evidence_obtained_prague", "knows_about_oracle"], privacyScoreEffect: 1, feedback: "Thinking ahead. +1 Score." }
    ]
  },
  'prague_ask_secondary_contact': {
    id: 'prague_ask_secondary_contact',
    locationTitle: "Prague: Backup Plans",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague contingency planning",
    narrative: "Lynx hesitates. 'Oracle is reliable. But... if you can't reach them, try a message board frequented by digital rights activists: 'The Algorithmic Resistance'. Post 'Seeking Oracle for Nightingale's song'. They'll know.'\n\nWith that, Lynx urges you to leave for Amsterdam.",
    choices: [
      { text: "Understood. Amsterdam it is.", nextSceneId: "amsterdam_travel_direct", setsFlags: ["knows_oracle_backup_plan"], privacyScoreEffect: 3, feedback: "Good to have a backup. +3 Score." }
    ]
  },
  'prague_contact_lynx_alternative_B': { 
    id: 'prague_contact_lynx_alternative_B',
    locationTitle: "Prague: Reaching out to Lynx Again",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech_republic.jpg",
    imageHint: "Prague secure messaging",
    narrative: "The kiosk meet seemed too risky after your decoy test. You send a secure message to Lynx: 'Kiosk compromised. Need alternative. Urgent.' Lynx replies quickly:\n'Damn. Okay, new plan. Amsterdam. Rendezvous at Cafe De Jaren, ask for 'Oracle'. I've sent the package ahead there through a secure courier. Password 'OrionPax'. This is safer.'",
    choices: [
      { text: "Acknowledge and prepare for Amsterdam.", nextSceneId: "amsterdam_travel_direct", privacyScoreEffect: 3, feedback: "Adapted to the situation. +3 Score." }
    ]
  },

  // --- AMSTERDAM (City C) ---
  'amsterdam_travel_direct': {
    id: 'amsterdam_travel_direct',
    locationTitle: "Travel to Amsterdam",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam canal scene arrival",
    narrative: "You make your way to Amsterdam. The city of canals and... secrets. You have Lynx's critical evidence (or instructions to meet Oracle at Cafe De Jaren to receive it/help decrypt it).\n\nNovaGen's shadow feels longer now.",
    choices: [
      { text: "Go directly to Cafe De Jaren to find Oracle.", nextSceneId: "amsterdam_cafe_de_jaren_find_oracle", privacyScoreEffect: 2, feedback: "Direct approach to contact. +2 Score." },
      { text: "First, secure a new burner phone and local SIM.", nextSceneId: "amsterdam_setup_comms_C", privacyScoreEffect: 5, feedback: "Good OPSEC in a new city. +5 Score." },
      { text: "Scout Cafe De Jaren before trying to make contact.", nextSceneId: "amsterdam_cafe_de_jaren_scout", privacyScoreEffect: 3, feedback: "Wise to observe first. +3 Score." }
    ]
  },
  'amsterdam_travel_direct_escape': {
    id: 'amsterdam_travel_direct_escape',
    locationTitle: "Hasty Travel to Amsterdam",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam night train arrival",
    narrative: "After the chaotic escape from Prague, you lie low and make your way to Amsterdam. You have the critical drive from Lynx.\n\nThe city feels both liberating and threatening.",
    choices: [
      { text: "Find Cafe De Jaren and look for Oracle.", nextSceneId: "amsterdam_cafe_de_jaren_find_oracle" , privacyScoreEffect: 0 },
      { text: "Establish a new secure base before contacting Oracle.", nextSceneId: "amsterdam_setup_base_C", privacyScoreEffect: 5, feedback: "Essential after Prague. +5 Score."},
      { text: "Try to verify if Lynx made it out of Prague safely.", nextSceneId: "amsterdam_check_on_lynx", privacyScoreEffect: -2, feedback: "Risky, could expose your presence. -2 Score.", requiresFlags: ["lynx_possibly_compromised_prague"] }
    ]
  },
  'amsterdam_check_on_lynx': {
    id: 'amsterdam_check_on_lynx',
    locationTitle: "Amsterdam: Checking on Lynx",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "dark web forum search",
    narrative: "You use secure channels to try and find news about Lynx's escape from Prague. It's difficult.\n\nYou find a cryptic post on a hidden forum: 'The Lynx is caged.' It seems NovaGen caught them. This is a terrible blow.",
    choices: [
      { text: "The mission must continue. Find Oracle.", nextSceneId: "amsterdam_cafe_de_jaren_find_oracle", setsFlags: ["lynx_compromised"], privacyScoreEffect: -5, feedback: "Lynx is caught. The pressure mounts. -5 Score." }
    ]
  },
  'amsterdam_setup_comms_C': {
    id: 'amsterdam_setup_comms_C',
    locationTitle: "Amsterdam: New Comms",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam phone shop secure",
    narrative: "You acquire a new burner phone and local SIM card in Amsterdam, minimizing your digital trail.\n\nNow, how to approach Cafe De Jaren and Oracle?",
    choices: [
      { text: "Go to Cafe De Jaren to find Oracle.", nextSceneId: "amsterdam_cafe_de_jaren_find_oracle", privacyScoreEffect: 2 },
      { text: "Scout Cafe De Jaren first.", nextSceneId: "amsterdam_cafe_de_jaren_scout", privacyScoreEffect: 3 },
      { text: "Use the new SIM to research Oracle's known digital footprint.", nextSceneId: "amsterdam_research_oracle_digital", privacyScoreEffect: 1, feedback: "Gathering intel on your contact. +1 Score."}
    ]
  },
  'amsterdam_research_oracle_digital': {
    id: 'amsterdam_research_oracle_digital',
    locationTitle: "Amsterdam: Oracle's Digital Footprint",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "laptop research social media Oracle",
    narrative: "Your research on Oracle reveals very little – a ghost. Some old, encrypted posts on privacy forums signed 'O'.\n\nThis person is clearly skilled at staying off the grid. Cafe De Jaren seems to be the only concrete lead.",
    choices: [
      { text: "Proceed to scout Cafe De Jaren.", nextSceneId: "amsterdam_cafe_de_jaren_scout", privacyScoreEffect: 1, feedback: "Oracle is cautious. Good. +1 Score."}
    ]
  },
  'amsterdam_setup_base_C': {
    id: 'amsterdam_setup_base_C',
    locationTitle: "Amsterdam: New Safe House",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam apartment interior discrete",
    narrative: "You find a discreet short-term rental in Amsterdam to use as a new base.\n\nFrom here, you can plan your meeting with Oracle at Cafe De Jaren more securely.",
    choices: [
      { text: "Time to scout Cafe De Jaren.", nextSceneId: "amsterdam_cafe_de_jaren_scout", privacyScoreEffect: 3 },
      { text: "Attempt to contact Oracle through a secure, anonymous channel first.", nextSceneId: "amsterdam_oracle_initial_contact", privacyScoreEffect: 1, feedback: "Very cautious approach. +1 Score."},
      { text: "Scan local networks for NovaGen activity before moving.", nextSceneId: "amsterdam_scan_local_networks", privacyScoreEffect: 2, feedback: "Checking for immediate threats. +2 Score."}
    ]
  },
  'amsterdam_scan_local_networks': {
    id: 'amsterdam_scan_local_networks',
    locationTitle: "Amsterdam: Network Scan",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "wifi scanner laptop Amsterdam",
    narrative: "You run a scan of nearby Wi-Fi networks and Bluetooth devices from your safe house. Nothing overtly screams 'NovaGen surveillance', but you do pick up a few unusually strong, encrypted signals.\n\nWorth noting. Time to focus on Oracle.",
    choices: [
      { text: "Scout Cafe De Jaren.", nextSceneId: "amsterdam_cafe_de_jaren_scout", privacyScoreEffect: 1, feedback: "Local awareness is good. +1 Score."}
    ]
  },
  'amsterdam_cafe_de_jaren_scout': {
    id: 'amsterdam_cafe_de_jaren_scout',
    locationTitle: "Amsterdam: Scouting Cafe De Jaren",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam cafe exterior canal",
    narrative: "Cafe De Jaren is a bustling, multi-level cafe by a canal. It's hard to spot specific surveillance, but it's also a place where one could easily blend in or be observed.\n\nYou see a quiet corner table with someone engrossed in a laptop covered in privacy stickers - could be Oracle.",
    choices: [
      { text: "Approach the individual with the privacy stickers.", nextSceneId: "amsterdam_oracle_approach_direct", privacyScoreEffect: 0 },
      { text: "Wait and observe them more, try to use the password if Lynx provided one.", nextSceneId: "amsterdam_oracle_approach_password", privacyScoreEffect: 2, feedback: "Using the password is safer. +2 Score.", requiresFlags: ["knows_about_oracle"] }, 
      { text: "Leave a coded message with the barista for 'Oracle'.", nextSceneId: "amsterdam_oracle_coded_message", privacyScoreEffect: -2, feedback: "Risky, might alert the wrong people. -2 Score." }
    ]
  },
  'amsterdam_cafe_de_jaren_find_oracle': {
    id: 'amsterdam_cafe_de_jaren_find_oracle',
    locationTitle: "Amsterdam: Cafe De Jaren",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam cafe interior busy",
    narrative: "You enter Cafe De Jaren. It's busy. You look for someone who might be 'Oracle'.\n\nYou spot a person at a corner table with a laptop covered in privacy stickers. They seem to be expecting someone.",
    choices: [
      { text: "Approach and ask if they are Oracle.", nextSceneId: "amsterdam_oracle_approach_direct", privacyScoreEffect: -2, feedback: "Direct and risky. -2 Score." },
      { text: "Approach and use the password 'Silent Sparrow' (if Lynx told you).", nextSceneId: "amsterdam_oracle_approach_password", privacyScoreEffect: 3, feedback: "Correct protocol. +3 Score.", requiresFlags: ["knows_about_oracle"] },
      { text: "Observe from another table, try to make eye contact.", nextSceneId: "amsterdam_oracle_observe_first", privacyScoreEffect: 1, feedback: "Cautious approach. +1 Score."}
    ]
  },
  'amsterdam_oracle_observe_first': {
    id: 'amsterdam_oracle_observe_first',
    locationTitle: "Amsterdam: Cafe De Jaren - Observation",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam cafe distant observation",
    narrative: "You take a seat at another table, observing the individual with the sticker-covered laptop. They occasionally scan the room.\n\nAfter a few minutes, they make eye contact with you and give a subtle nod towards an empty chair at their table.",
    choices: [
      { text: "Approach their table.", nextSceneId: "amsterdam_oracle_approach_direct", privacyScoreEffect: 2, feedback: "They noticed you. Proceed cautiously. +2 Score." }
    ]
  },
  'amsterdam_oracle_initial_contact': {
    id: 'amsterdam_oracle_initial_contact',
    locationTitle: "Amsterdam: Anonymous Contact with Oracle",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam laptop secure message",
    narrative: "You manage to send an anonymous, encrypted message to a known contact point for Oracle, mentioning Lynx. A reply comes:\n'Cafe De Jaren. Tomorrow, 3 PM. Order a mint tea. I will find you.'",
    choices: [
      { text: "Go to Cafe De Jaren tomorrow as instructed.", nextSceneId: "amsterdam_oracle_meet_instructed", privacyScoreEffect: 5, feedback: "Following secure instructions. +5 Score."},
      { text: "Confirm the message's authenticity with a pre-agreed code phrase.", nextSceneId: "amsterdam_oracle_verify_message_code", privacyScoreEffect: 2, feedback: "Double-checking authenticity. +2 Score."}
    ]
  },
  'amsterdam_oracle_verify_message_code': {
    id: 'amsterdam_oracle_verify_message_code',
    locationTitle: "Amsterdam: Verifying Oracle's Message",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "encrypted message confirmation",
    narrative: "You reply with a pre-agreed challenge phrase only the real Oracle (or Lynx's close contacts) would know. A correct response comes back quickly.\n\nThe meet is legitimate.",
    choices: [
      { text: "Proceed to Cafe De Jaren as planned.", nextSceneId: "amsterdam_oracle_meet_instructed", privacyScoreEffect: 3, feedback: "Verification successful. +3 Score."}
    ]
  },
  'amsterdam_oracle_meet_instructed': {
    id: 'amsterdam_oracle_meet_instructed',
    locationTitle: "Amsterdam: The Mint Tea Meet",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam cafe table mint tea",
    narrative: "You're at Cafe De Jaren, mint tea ordered. A figure approaches your table. 'Oracle?' you ask. They nod. 'Lynx sent you. And the package, I presume?' (This assumes Lynx sent it ahead as per 'prague_signal_lynx_abort' or you have it).\n\n'It needs careful decryption. NovaGen uses custom algorithms.'",
    choices: [
      { text: "Yes, I have the drive (or Lynx said you have it). Let's decrypt.", nextSceneId: "amsterdam_decrypt_puzzle_intro", setsFlags: ["met_oracle", "critical_evidence_obtained_prague"], privacyScoreEffect: 5, feedback: "Time to get to work. +5 Score." },
      { text: "First, let's move to a more secure location.", nextSceneId: "amsterdam_oracle_relocate", setsFlags: ["met_oracle", "critical_evidence_obtained_prague"], privacyScoreEffect: 2, feedback: "Good caution. +2 Score."},
      { text: "How do I know I can trust you?", nextSceneId: "amsterdam_oracle_trust_challenge", setsFlags: ["met_oracle", "critical_evidence_obtained_prague"], privacyScoreEffect: 0, feedback: "A direct question."}
    ],
    requiresFlags: ["critical_evidence_obtained_prague"]
  },
  'amsterdam_oracle_relocate': {
    id: 'amsterdam_oracle_relocate',
    locationTitle: "Amsterdam: Oracle's Secure Workshop",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam hacker den computers",
    narrative: "Oracle nods in agreement. 'Good call. This place is too public for what's next.'\n\nThey lead you through a maze of canalside streets to a discreet, heavily secured workshop. 'Here, we can work undisturbed.'",
    choices: [
      { text: "Present the drive. Let's decrypt.", nextSceneId: "amsterdam_decrypt_puzzle_intro", privacyScoreEffect: 3, feedback: "Secure location achieved. +3 Score."}
    ]
  },
  'amsterdam_oracle_trust_challenge': {
    id: 'amsterdam_oracle_trust_challenge',
    locationTitle: "Amsterdam: Questioning Oracle",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam tense gaze cafe",
    narrative: "Oracle smiles faintly. 'Lynx wouldn't have sent you if I wasn't trustworthy. And Lynx wouldn't have sent the package this way unless it was vital. The password 'OrionPax' should be proof enough of my connection. NovaGen plays for keeps; we don't have time for doubt.'",
    choices: [
      { text: "You're right. Let's decrypt the drive.", nextSceneId: "amsterdam_decrypt_puzzle_intro", privacyScoreEffect: 1, feedback: "Trust established. +1 Score."}
    ]
  },
  'amsterdam_oracle_approach_direct': {
    id: 'amsterdam_oracle_approach_direct',
    locationTitle: "Amsterdam: Approaching Oracle",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam tense cafe conversation",
    narrative: "You approach the individual. 'Are you Oracle?' They look up, wary. 'Who's asking?'",
    choices: [
      { text: "Mention Lynx and 'Silent Sparrow'.", nextSceneId: "amsterdam_oracle_password_accepted", privacyScoreEffect: 5, feedback: "Password recognized. +5 Score." },
      { text: "Try to explain your mission without revealing too much.", nextSceneId: "amsterdam_oracle_vague_explanation", privacyScoreEffect: -3, feedback: "Vagueness makes you suspicious. -3 Score." },
      { text: "Show them a piece of encrypted data from Lynx as proof.", nextSceneId: "amsterdam_oracle_show_data_proof", privacyScoreEffect: 2, feedback: "Showing proof of connection. +2 Score."}
    ]
  },
  'amsterdam_oracle_show_data_proof': {
    id: 'amsterdam_oracle_show_data_proof',
    locationTitle: "Amsterdam: Proof of Connection",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "encrypted code phone screen Amsterdam",
    narrative: "You discreetly show Oracle your encrypted device with a snippet of data clearly originating from Lynx. Oracle examines it, nods. 'Alright. You're the real deal. Lynx mentioned you. Let's talk. But not here.'\n\nOracle suggests moving to their workshop.",
    choices: [
      { text: "Go with Oracle to their workshop.", nextSceneId: "amsterdam_oracle_relocate", setsFlags: ["met_oracle", "critical_evidence_obtained_prague"], privacyScoreEffect: 5, feedback: "Trust established, moving to secure location. +5 Score."}
    ]
  },
  'amsterdam_oracle_approach_password': {
    id: 'amsterdam_oracle_approach_password',
    locationTitle: "Amsterdam: Password Accepted",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam knowing nod cafe",
    narrative: "You approach and say, 'Silent Sparrow sent me. I'm looking for Oracle.' The individual nods slowly. 'You found them. Lynx mentioned you'd be coming. You have the drive?'\n\nTheir eyes scan the cafe.",
    choices: [
      { text: "Yes, I have the drive from Lynx. Password 'OrionPax'.", nextSceneId: "amsterdam_decrypt_puzzle_intro", setsFlags: ["met_oracle", "critical_evidence_obtained_prague"], privacyScoreEffect: 5, feedback: "Confirmed. +5 Score." },
      { text: "Be cautious. Ask for their verification first.", nextSceneId: "amsterdam_oracle_verify_oracle", privacyScoreEffect: 2, feedback: "Double-checking. +2 Score." },
      { text: "Suggest moving to a more private location before showing the drive.", nextSceneId: "amsterdam_oracle_relocate", setsFlags: ["met_oracle", "critical_evidence_obtained_prague"], privacyScoreEffect: 3, feedback: "Good OPSEC. +3 Score." }
    ]
  },
  'amsterdam_oracle_password_accepted': {
    id: 'amsterdam_oracle_password_accepted',
    locationTitle: "Amsterdam: Oracle Confirmed",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam cafe tech discussion",
    narrative: "Mentioning Lynx and 'Silent Sparrow' works. Oracle relaxes slightly. 'Alright. Lynx trusts you, so I will too. You have the drive from Prague? Password 'OrionPax' for initial access, but the core files are heavily encrypted.'",
    choices: [
       { text: "Yes, here it is. Let's get to work.", nextSceneId: "amsterdam_decrypt_puzzle_intro", setsFlags: ["met_oracle","critical_evidence_obtained_prague"], privacyScoreEffect: 5, feedback: "Time to decrypt. +5 Score." }
    ],
    requiresFlags: ["critical_evidence_obtained_prague"]
  },
  'amsterdam_oracle_vague_explanation': {
    id: 'amsterdam_oracle_vague_explanation',
    locationTitle: "Amsterdam: Oracle Suspicious",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam cafe suspicious look",
    narrative: "Your vague explanation makes Oracle more wary. 'I don't know what you're talking about.'\n\nThey discreetly signal a barista and prepare to leave. You've blown your chance with Oracle.",
    choices: [
      { text: "Try to salvage it by mentioning Lynx now.", nextSceneId: "amsterdam_oracle_approach_direct" , privacyScoreEffect: -2, feedback: "Late, but worth a shot. -2 Score."},
      { text: "Abort. You'll have to find another way.", nextSceneId: "amsterdam_oracle_failed_contact", privacyScoreEffect: -5, feedback: "Lost Oracle contact. -5 Score."}, 
      { text: "Subtly try to use the backup contact phrase 'Seeking Oracle for Nightingale's song'.", nextSceneId: "amsterdam_oracle_backup_phrase_attempt", requiresFlags: ["knows_oracle_backup_plan"], privacyScoreEffect: 0, feedback: "A long shot to recover." }
    ]
  },
  'amsterdam_oracle_backup_phrase_attempt': {
    id: 'amsterdam_oracle_backup_phrase_attempt',
    locationTitle: "Amsterdam: Desperate Recovery",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam tense whisper cafe",
    narrative: "As Oracle prepares to leave, you lean in and quietly say, 'I'm seeking Oracle for Nightingale's song.'\n\nOracle pauses, surprised. 'Where did you hear that?' This might just salvage the situation.",
    choices: [
      { text: "Explain Lynx provided it as a backup.", nextSceneId: "amsterdam_oracle_password_accepted", privacyScoreEffect: 3, feedback: "Backup phrase worked! +3 Score." },
      { text: "Refuse to say, just reiterate you need Oracle.", nextSceneId: "amsterdam_oracle_failed_contact", privacyScoreEffect: -2, feedback: "Suspicion remains too high. -2 Score."}
    ]
  },
  'amsterdam_oracle_coded_message': {
    id: 'amsterdam_oracle_coded_message',
    locationTitle: "Amsterdam: Message Intercepted?",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam news alert phone",
    narrative: "You leave a coded message with the barista. Hours pass, no response.\n\nLater, you see news of a 'security incident' at Cafe De Jaren. Your message might have been intercepted by NovaGen.",
    choices: [
      { text: "Assume Oracle is compromised. You're on your own with the drive.", nextSceneId: "amsterdam_decrypt_solo", privacyScoreEffect: -5, feedback: "Oracle compromised, mission in jeopardy. -5 Score." }, 
      { text: "Try the backup contact method via 'The Algorithmic Resistance' message board.", nextSceneId: "amsterdam_algorithmic_resistance_contact", requiresFlags: ["knows_oracle_backup_plan"], privacyScoreEffect: 0, feedback: "Trying the backup plan."}
    ]
  },
  'amsterdam_algorithmic_resistance_contact': {
    id: 'amsterdam_algorithmic_resistance_contact',
    locationTitle: "Amsterdam: Algorithmic Resistance Forum",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "dark web forum message post",
    narrative: "You find 'The Algorithmic Resistance' message board and post 'Seeking Oracle for Nightingale's song'.\n\nA day later, an encrypted reply: 'Mint tea. Cafe De Jaren. Tomorrow. 3 PM.' It seems the backup plan worked.",
    choices: [
      { text: "Go to Cafe De Jaren as instructed.", nextSceneId: "amsterdam_oracle_meet_instructed", privacyScoreEffect: 3, feedback: "Backup contact successful. +3 Score."}
    ]
  },
  'amsterdam_oracle_verify_oracle': {
    id: 'amsterdam_oracle_verify_oracle',
    locationTitle: "Amsterdam: Verifying Oracle",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam secret handshake cafe",
    narrative: "You ask Oracle for verification. They smile faintly. 'Lynx said you might. What was the codename for Project Chimera?'\n\nYou recall Lynx mentioning it: 'Nightshade'.",
    choices: [
      { text: "Answer: 'Nightshade'.", nextSceneId: "amsterdam_decrypt_puzzle_intro", setsFlags: ["met_oracle", "critical_evidence_obtained_prague"], privacyScoreEffect: 5, feedback: "Correct verification! Trust established. +5 Score."},
      { text: "Answer: 'Hydra'. (Wrong)", nextSceneId: "amsterdam_oracle_failed_verification", privacyScoreEffect: -5, feedback: "Wrong answer. Oracle is now very suspicious. -5 Score."},
      { text: "Say 'I don't recall, but Lynx trusts you implicitly.'", nextSceneId: "amsterdam_oracle_bluff_verification", privacyScoreEffect: -2, feedback: "Trying to bluff. -2 Score."}
    ]
  },
  'amsterdam_oracle_bluff_verification': {
    id: 'amsterdam_oracle_bluff_verification',
    locationTitle: "Amsterdam: Failed Bluff",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam suspicious stare cafe",
    narrative: "Oracle isn't impressed by your attempt to bluff. 'Lynx always uses challenge phrases for a reason. This meeting is over.'\n\nOracle leaves abruptly.",
    choices: [
      { text: "You've lost Oracle. Try to decrypt the drive solo.", nextSceneId: "amsterdam_decrypt_solo", privacyScoreEffect: -5, feedback: "Failed to establish trust. -5 Score." } 
    ]
  },
  'amsterdam_oracle_failed_verification': {
    id: 'amsterdam_oracle_failed_verification',
    locationTitle: "Amsterdam: Verification Failed",
    image: "https://i.ibb.co/21t4CJjS/a_shot_of_cafe_de_jaren_amsterdam.jpg",
    imageHint: "Amsterdam cafe tense exit",
    narrative: "Oracle's eyes narrow at your incorrect answer. 'You're not who Lynx sent.'\n\nThey make a discreet call. You sense danger and quickly leave the cafe. Oracle contact lost.",
    choices: [
      { text: "You still have the drive. Attempt to decrypt it solo.", nextSceneId: "amsterdam_decrypt_solo", privacyScoreEffect: -5, feedback: "Lost Oracle, very difficult now. -5 Score." } 
    ]
  },
  'amsterdam_oracle_failed_contact': {
    id: 'amsterdam_oracle_failed_contact',
    locationTitle: "Amsterdam: On Your Own",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam lone figure canal",
    narrative: "You failed to connect with Oracle. The encrypted drive from Lynx is your only hope, but decrypting its final layers without expert help will be incredibly difficult and risky.",
    choices: [
      { text: "Find a secure location and attempt solo decryption.", nextSceneId: "amsterdam_decrypt_solo", privacyScoreEffect: -5, feedback: "A daunting task alone. -5 Score." }, 
      { text: "Try the backup plan: 'The Algorithmic Resistance' forum.", nextSceneId: "amsterdam_algorithmic_resistance_contact", requiresFlags: ["knows_oracle_backup_plan"], privacyScoreEffect: 0, feedback: "Attempting fallback."}
    ]
  },
  'amsterdam_decrypt_puzzle_intro': {
    id: 'amsterdam_decrypt_puzzle_intro',
    locationTitle: "Amsterdam: Oracle's Workshop",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam hacker den computers",
    narrative: "Oracle leads you to a hidden workshop, filled with tech. 'Alright, let's see this drive. Lynx said NovaGen used a layered Caesar cipher, but the final layer is keyed to a passphrase related to their first major breakthrough. Lynx thought you might know it or be able to find a clue in the initial decrypted files from USB A (if you got them).'",
    miniPuzzle: {
      type: "PassphraseChallenge",
      title: "Decode Lynx's Critical Intel",
      description: "The drive is protected by a passphrase. Oracle has handled the outer layers. The final key is a passphrase. Clue: 'NovaGen's first patented compound'. You might find this in earlier intel or need to deduce it. What's the passphrase?"
    },
    choices: [
      { text: "Attempt to enter passphrase: 'SYNTHOCORTEX'", nextSceneId: "amsterdam_decrypt_success_C", privacyScoreEffect: 5, feedback: "Correct! The final files are decrypting! +5 Score.", setsFlags: ["critical_evidence_fully_decrypted"] },
      { text: "Attempt to enter passphrase: 'GENESYS'", nextSceneId: "amsterdam_decrypt_fail_C1", privacyScoreEffect: -5, feedback: "Incorrect. Try again. -5 Score." },
      { text: "Ask Oracle for help or more clues (costs time/risk).", nextSceneId: "amsterdam_oracle_ask_help_decrypt", privacyScoreEffect: -2, feedback: "Oracle can help, but it might have costs. -2 Score." }
    ],
    requiresFlags: ["critical_evidence_obtained_prague", "met_oracle"]
  },
  'amsterdam_decrypt_fail_C1': {
    id: 'amsterdam_decrypt_fail_C1',
    locationTitle: "Amsterdam: Decryption Failed (Attempt 1)",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam computer error screen",
    narrative: "Oracle shakes their head. 'That's not it. NovaGen's security is tight.\n\nOne more try before the drive locks us out.'",
    miniPuzzle: {
      type: "PassphraseChallenge",
      title: "Decode Lynx's Critical Intel (Attempt 2)",
      description: "Incorrect passphrase. One attempt remaining. Clue: 'NovaGen's first patented compound'."
    },
    choices: [
      { text: "Attempt to enter passphrase: 'SYNTHOCORTEX'", nextSceneId: "amsterdam_decrypt_success_C", privacyScoreEffect: 5, feedback: "Correct! +5 Score.", setsFlags: ["critical_evidence_fully_decrypted"] },
      { text: "Attempt to enter passphrase: 'BIOSTABIL'", nextSceneId: "amsterdam_decrypt_fail_C2_locked", privacyScoreEffect: -10, feedback: "Incorrect. Drive locked! -10 Score.", setsFlags: ["critical_evidence_locked"] },
      { text: "Ask Oracle to try a brute-force (very risky).", nextSceneId: "amsterdam_oracle_brute_force_decrypt", privacyScoreEffect: -5, feedback: "Brute force is dangerous. -5 Score." } 
    ]
  },
  'amsterdam_decrypt_fail_C2_locked': {
    id: 'amsterdam_decrypt_fail_C2_locked',
    locationTitle: "Amsterdam: EVIDENCE LOCKED",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam locked hard drive",
    narrative: "The drive flashes red. 'Locked out,' Oracle sighs. 'NovaGen's counter-intrusion protocols. The critical evidence is inaccessible.'\n\nThis is a devastating blow.",
    choices: [
      { text: "This is a disaster. What now?", nextSceneId: "gameOver_lose_insufficient_evidence", gameOverMessage: "The critical evidence was lost due to failed decryption. NovaGen's secrets remain safe. Mission Failed.", privacyScoreEffect: -20 }
    ]
  },
  'amsterdam_oracle_ask_help_decrypt': {
    id: 'amsterdam_oracle_ask_help_decrypt',
    locationTitle: "Amsterdam: Oracle's Help",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam Oracle thinking",
    narrative: "Oracle considers. 'I can try some backdoors, but it'll take time and make noise on their networks. If they detect it, they'll know we have the drive. Risky.'",
    choices: [
      { text: "Proceed with Oracle's risky attempt.", nextSceneId: "amsterdam_oracle_risky_decrypt_result", privacyScoreEffect: -5, feedback: "High risk, high reward? -5 Score." },
      { text: "No, too risky. Let me try one more passphrase guess.", nextSceneId: "amsterdam_decrypt_fail_C1" },
      { text: "Let's review the initial Berlin USB data for clues first.", nextSceneId: "amsterdam_review_berlin_usb_clues", requiresFlags:["usb_A_retrieved"], privacyScoreEffect: 2, feedback: "Good idea to look for clues. +2 Score." }
    ]
  },
  'amsterdam_review_berlin_usb_clues': {
    id: 'amsterdam_review_berlin_usb_clues',
    locationTitle: "Amsterdam: Searching for Clues",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "data files searching clues",
    narrative: "You and Oracle meticulously go over the decrypted files from the first USB Lynx provided in Berlin.\n\nBuried in a research proposal is a footnote mentioning NovaGen's first successful compound: 'Project SynthroCortex'. That could be it!",
    choices: [
      { text: "Try passphrase 'SYNTHOCORTEX'.", nextSceneId: "amsterdam_decrypt_success_C", privacyScoreEffect: 5, feedback: "Clue found! Correct passphrase. +5 Score.", setsFlags: ["critical_evidence_fully_decrypted"] },
      { text: "This must be it. Try 'PROJECT SYNTHOCORTEX'.", nextSceneId: "amsterdam_decrypt_fail_C1", privacyScoreEffect: -2, feedback: "Close, but not quite. -2 Score." }
    ]
  },
  'amsterdam_oracle_brute_force_decrypt': {
    id: 'amsterdam_oracle_brute_force_decrypt',
    locationTitle: "Amsterdam: Brute Force Attempt",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam computer alarms",
    narrative: "Oracle initiates a brute-force attack. Alarms blare on their console. 'They detected us! And the drive just wiped itself!' Oracle exclaims.\n\n'We need to get out of here, NOW!'",
    choices: [
      { text: "Escape with Oracle!", nextSceneId: "gameOver_lose_insufficient_evidence", gameOverMessage: "The brute force attempt failed catastrophically, wiping the drive and alerting NovaGen. Mission Failed.", privacyScoreEffect: -25 }
    ]
  },
  'amsterdam_oracle_risky_decrypt_result': {
    id: 'amsterdam_oracle_risky_decrypt_result',
    locationTitle: "Amsterdam: Oracle's Gamble",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam Oracle success",
    narrative: "Oracle works furiously. Hours pass. 'Got it!' they exclaim, 'But they definitely registered the intrusion attempt. They'll be hunting us.\n\nThe data is decrypted. Full proof of NovaGen's illegal trials.'",
    choices: [
      { text: "We have the proof! Time to publish. Where to?", nextSceneId: "reykjavik_travel_prep_D", setsFlags: ["critical_evidence_fully_decrypted", "novagen_alerted_amsterdam"], privacyScoreEffect: 5, feedback: "Got the data, but alerted NovaGen. +5 Score."}
    ]
  },
  'amsterdam_decrypt_success_C': {
    id: 'amsterdam_decrypt_success_C',
    locationTitle: "Amsterdam: CRITICAL INTEL DECRYPTED!",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam data stream success screen",
    narrative: "The final layer of encryption breaks! Oracle grins. 'There it is. Irrefutable proof: video logs, internal memos, patient data. Everything. Lynx was right.'\n\nOracle suggests, 'Reykjavik, Iceland. Good data havens, strong press protections. The best place to upload this without interference.'",
    choices: [
      { text: "Reykjavik it is. Let's prepare to move the data.", nextSceneId: "reykjavik_travel_prep_D", privacyScoreEffect: 5, feedback: "The smoking gun! +5 Score." },
      { text: "Should we verify this data with another expert first?", nextSceneId: "amsterdam_verify_data_expert", privacyScoreEffect: -2, feedback: "Delay could be costly. -2 Score." },
      { text: "Can we leak parts of it now from here to build pressure?", nextSceneId: "amsterdam_leak_partial_data", privacyScoreEffect: -5, feedback: "Risky, could tip NovaGen off too early. -5 Score." }
    ]
  },
  'amsterdam_decrypt_solo': {
    id: 'amsterdam_decrypt_solo',
    locationTitle: "Amsterdam: Solo Decryption Attempt",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam lone hacker dark room",
    narrative: "Without Oracle, you're on your own. You find a relatively secure spot and begin the arduous process of trying to decrypt Lynx's main drive.\n\nIt's far more complex than USB A. Days blur into nights.",
    miniPuzzle: {
      type: "PassphraseChallenge",
      title: "Solo Decryption: Lynx's Drive",
      description: "The drive is heavily encrypted. Lynx mentioned the passphrase for the final layer was related to 'NovaGen's first patented compound'. What is it?"
    },
    choices: [
      { text: "Enter passphrase: 'SYNTHOCORTEX'", nextSceneId: "amsterdam_decrypt_success_solo", privacyScoreEffect: 5, feedback: "Incredible! You cracked it alone! +5 Score.", setsFlags: ["critical_evidence_fully_decrypted"] },
      { text: "Enter passphrase: 'GENESYS'", nextSceneId: "amsterdam_decrypt_solo_fail1", privacyScoreEffect: -5, feedback: "Incorrect. This is harder than you thought. -5 Score." }, 
      { text: "Give up on solo decryption. Try to find another contact.", nextSceneId: "amsterdam_find_alt_contact", privacyScoreEffect: -5, feedback: "Wasted valuable time. -5 Score." } 
    ]
  },
  'amsterdam_decrypt_solo_fail1': {
    id: 'amsterdam_decrypt_solo_fail1',
    locationTitle: "Amsterdam: Solo Decryption - Setback",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam computer error frustrated",
    narrative: "That passphrase was incorrect. The encryption holds.\n\nYou feel NovaGen's net tightening. One more try before you risk locking the drive or getting caught.",
    miniPuzzle: {
      type: "PassphraseChallenge",
      title: "Solo Decryption: Lynx's Drive (Last Chance!)",
      description: "Incorrect. One more attempt. Clue: 'NovaGen's first patented compound'."
    },
    choices: [
      { text: "Enter passphrase: 'SYNTHOCORTEX'", nextSceneId: "amsterdam_decrypt_success_solo", privacyScoreEffect: 5, setsFlags: ["critical_evidence_fully_decrypted"] },
      { text: "Enter passphrase: 'BIOSTABIL'", nextSceneId: "gameOver_lose_insufficient_evidence", gameOverMessage: "Solo decryption failed. The drive is locked or you were traced. Mission Failed.", privacyScoreEffect: -20 },
      { text: "Try to find clues in previously decrypted data from Berlin (if available).", nextSceneId: "amsterdam_review_berlin_usb_clues_solo", requiresFlags:["usb_A_retrieved"], privacyScoreEffect: 2, feedback: "Searching for clues again. +2 Score." }
    ]
  },
  'amsterdam_review_berlin_usb_clues_solo': {
    id: 'amsterdam_review_berlin_usb_clues_solo',
    locationTitle: "Amsterdam: Solo Clue Search",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "data files searching clues solo",
    narrative: "Working alone, you re-examine the files from the first Berlin USB.\n\nThe footnote mentioning 'Project SynthroCortex' stands out. This has to be it.",
    choices: [
      { text: "Try passphrase 'SYNTHOCORTEX'.", nextSceneId: "amsterdam_decrypt_success_solo", privacyScoreEffect: 5, feedback: "Clue found! Correct passphrase. +5 Score.", setsFlags: ["critical_evidence_fully_decrypted"] }
    ]
  },
  'amsterdam_decrypt_success_solo': {
    id: 'amsterdam_decrypt_success_solo',
    locationTitle: "Amsterdam: Solo Decryption SUCCESS!",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam success screen bright",
    narrative: "Against all odds, you crack the encryption! The drive reveals everything – NovaGen's horrific trials.\n\nYou need to get this to the world. Reykjavik seems like the best bet for a secure upload.",
    choices: [
      { text: "Prepare for Reykjavik. Time to publish.", nextSceneId: "reykjavik_travel_prep_D", privacyScoreEffect: 5, feedback: "Amazing work! +5 Score." }
    ]
  },
   'amsterdam_find_alt_contact': {
    id: 'amsterdam_find_alt_contact',
    locationTitle: "Amsterdam: Seeking New Help",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam shady contact alley",
    narrative: "Solo decryption is too much. You spend days trying to find another trusted contact in Amsterdam's underground tech scene. It's risky, exposing you more.\n\nYou eventually find 'Glitch', a less reliable but capable hacker.",
    choices: [
      { text: "Ask Glitch to help decrypt (costs money/favors).", nextSceneId: "amsterdam_glitch_decrypt_deal", privacyScoreEffect: -5, feedback: "Dealing with Glitch is a gamble. -5 Score." },
      { text: "Too risky. Abort mission. The evidence is too hard to get.", nextSceneId: "gameOver_lose_aborted_mission_C", gameOverMessage: "You aborted the mission in Amsterdam, unable to decrypt the evidence. NovaGen wins.", privacyScoreEffect: -15 },
      { text: "Attempt to leak the encrypted drive as-is to a journalist.", nextSceneId: "amsterdam_leak_encrypted_drive", privacyScoreEffect: -3, feedback: "Might work if journalist can decrypt. -3 Score."}
    ]
  },
  'amsterdam_leak_encrypted_drive': {
    id: 'amsterdam_leak_encrypted_drive',
    locationTitle: "Amsterdam: Leaking Encrypted Data",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "secure data transfer journalist",
    narrative: "You anonymously send the encrypted drive to a well-known investigative journalist, hoping their team has the resources to crack it.\n\nIt's out of your hands now. This might be the end of your involvement.",
    choices: [
      { text: "Hope the journalist succeeds. What's next for you?", nextSceneId: "gameOver_lose_insufficient_evidence", gameOverMessage: "You leaked the encrypted data, but its impact is uncertain. Your direct mission ends here." , privacyScoreEffect: -10}
    ]
  },
  'amsterdam_glitch_decrypt_deal': {
    id: 'amsterdam_glitch_decrypt_deal',
    locationTitle: "Amsterdam: Glitch's Deal",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam hacker deal success",
    narrative: "'Glitch' agrees to help, for a hefty price (a future favor that will surely be dangerous). After some tense hours, Glitch bypasses the encryption. 'There's your data, hero. Now about that favor... later.'\n\nYou have the proof. Reykjavik for upload?",
    choices: [
      { text: "Yes, Reykjavik. The world needs to see this.", nextSceneId: "reykjavik_travel_prep_D", setsFlags: ["critical_evidence_fully_decrypted", "owes_glitch_favor"], privacyScoreEffect: 5, feedback: "Evidence secured, but at a cost. +5 Score."}
    ]
  },
   'amsterdam_verify_data_expert': {
    id: 'amsterdam_verify_data_expert',
    locationTitle: "Amsterdam: Expert Verification",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam data verification remote",
    narrative: "Oracle (or you, if solo) arranges for a trusted, independent biotech expert to remotely verify a small, anonymized sample of the data. They confirm: it's genuine and explosive.\n\nThis took an extra day, increasing risk.",
    choices: [
      { text: "Data verified. Now to Reykjavik to publish.", nextSceneId: "reykjavik_travel_prep_D", privacyScoreEffect: -3, feedback: "Verification adds credibility but cost time. -3 Score." },
      { text: "Leak the expert's verification along with the data.", nextSceneId: "reykjavik_travel_prep_D", setsFlags:["expert_verification_obtained"], privacyScoreEffect: 0, feedback: "Adds weight to the leak. Net 0 score."}
    ]
  },
  'amsterdam_leak_partial_data': {
    id: 'amsterdam_leak_partial_data',
    locationTitle: "Amsterdam: Partial Leak Attempt",
    image: "https://i.ibb.co/TqBk9wmM/amsterdam.jpg",
    imageHint: "Amsterdam news alert phone screen",
    narrative: "You try to leak some data from Amsterdam. It causes a minor stir online, but NovaGen's PR team quickly dismisses it as fake.\n\nWorse, they've intensified their hunt. Oracle urges: 'Full dump from Reykjavik is the only way!'",
    choices: [
      { text: "Agreed. Prepare for Reykjavik.", nextSceneId: "reykjavik_travel_prep_D", privacyScoreEffect: -5, feedback: "Partial leak backfired. NovaGen more alert. -5 Score." } 
    ]
  },


  // --- REYKJAVIK (City D) ---
  'reykjavik_travel_prep_D': {
    id: 'reykjavik_travel_prep_D',
    locationTitle: "Preparing for Reykjavik",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik packing bags snow gear",
    narrative: "You have the complete, decrypted evidence against NovaGen. Reykjavik, Iceland, is your destination for the upload.\n\nThe stakes have never been higher. NovaGen will do anything to stop this from getting out, especially if they were alerted by your activities in Amsterdam.",
    choices: [
      { text: "Arrange ultra-secure, anonymous travel to Reykjavik.", nextSceneId: "reykjavik_arrival_D", privacyScoreEffect: 5, feedback: "Top-tier OPSEC for the final leg. +5 Score." },
      { text: "Standard commercial flight, but with enhanced digital hygiene.", nextSceneId: "reykjavik_arrival_D", privacyScoreEffect: 5, feedback: "Good, but commercial travel has inherent risks. +5 Score." },
      { text: "Charter a private boat - slow, but off-grid.", nextSceneId: "reykjavik_arrival_D", privacyScoreEffect: 5, feedback: "Unconventional and hard to trace. +5 Score." }
    ],
    requiresFlags: ["critical_evidence_fully_decrypted"]
  },
  'reykjavik_arrival_D': {
    id: 'reykjavik_arrival_D',
    locationTitle: "Reykjavik: The Final Stage",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik cityscape winter snow",
    narrative: "You arrive in Reykjavik. The air is cold, crisp. This is it. Time to expose NovaGen.\n\nFirst, you need to redact any metadata from image/video files that could identify Lynx or other sources. This is crucial to protect them. You have two attempts to get this right. Poor redaction will have severe consequences for your sources and the mission.",
    miniPuzzle: {
      type: "MetadataRedaction",
      title: "Redact Evidence Metadata (2 Attempts)",
      description: "Before uploading, ensure all photos and videos are stripped of EXIF data (GPS, timestamps, camera models) that could trace them back to Lynx or acquisition locations. Select only the sensitive tags to redact. Failing to do this properly could endanger your sources!",
      puzzleData: {
        items: [
          { id: 'gps_berlin_hq', label: 'GPS: NovaGen Berlin HQ (Image A)', sensitive: true },
          { id: 'timestamp_trial_A', label: 'Timestamp: Patient Trial Log Entry (Video B)', sensitive: true },
          { id: 'camera_lynx_apt', label: 'Camera Model: Lynx Apt Photo (Image C)', sensitive: true },
          { id: 'image_resolution', label: 'Image Resolution: 4032x3024 (All Images)', sensitive: false },
          { id: 'file_format_video', label: 'File Format: MP4 H.264 (All Videos)', sensitive: false },
          { id: 'device_whistleblower', label: 'Device ID: Whistleblower Phone (Audio File)', sensitive: true },
          { id: 'author_internal_memo', label: 'Author: Dr. Aris Thorne (Internal Memo)', sensitive: true },
          { id: 'creation_date_report', label: 'Creation Date: Financial Report Q3', sensitive: false },
        ]
      }
    },
    choices: [] 
  },
  'reykjavik_metadata_redacted': {
    id: 'reykjavik_metadata_redacted',
    locationTitle: "Reykjavik: Metadata Cleaned",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik laptop metadata clean",
    narrative: "You meticulously scrubbed the critical metadata from the evidence files. Lynx and other potential sources are now much safer.\n\nNow, to choose your upload method...",
    choices: [
      { text: "Upload to multiple whistleblowing platforms via Tor.", nextSceneId: "reykjavik_upload_tor_platforms", privacyScoreEffect: 5, feedback: "Good redundancy and anonymity. +5 Score." },
      { text: "Contact a renowned investigative journalist with a secure PGP-encrypted handoff.", nextSceneId: "reykjavik_upload_journalist_pgp", privacyScoreEffect: 5, feedback: "Trusted journalist, secure handoff. +5 Score." },
      { text: "Use a public Wi-Fi and a less secure quick upload service (fast but risky).", nextSceneId: "reykjavik_upload_public_wifi_fast", privacyScoreEffect: -5, feedback: "Very risky for such critical data! -5 Score." } 
    ]
  },
  'reykjavik_upload_choice_no_redact': { 
    id: 'reykjavik_upload_choice_no_redact',
    locationTitle: "Reykjavik: Publishing Partially Redacted (Risky)",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik risky upload screen",
    narrative: "Your metadata redaction was incomplete or flawed. This poses a significant risk to your sources.\n\nYou must proceed with extreme caution for the upload.",
    choices: [
      { text: "Upload to multiple whistleblowing platforms via Tor.", nextSceneId: "reykjavik_upload_tor_platforms", privacyScoreEffect: 0, feedback: "Sources at risk, but Tor helps your anonymity." },
      { text: "Contact a journalist, PGP handoff (warn them about metadata).", nextSceneId: "reykjavik_upload_journalist_pgp", privacyScoreEffect: -2, feedback: "Journalist might redact, but still risky." },
      { text: "Public Wi-Fi, quick upload (very high risk to sources).", nextSceneId: "reykjavik_upload_public_wifi_fast", privacyScoreEffect: -15, feedback: "Maximum risk to sources and self. -15 Score." }
    ]
  },
  'reykjavik_metadata_auto_redact': { 
    id: 'reykjavik_metadata_auto_redact',
    locationTitle: "Reykjavik: Auto-Redacted Metadata",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik laptop auto redact",
    narrative: "Your redaction attempt was only partially successful, similar to using an automated tool. Some sensitive metadata might remain.\n\nYou hope it's enough. Now, how to upload?",
    choices: [
      { text: "Upload to multiple platforms via Tor.", nextSceneId: "reykjavik_upload_tor_platforms", privacyScoreEffect: 5, feedback: "Better than nothing, Tor helps. +5 Score." },
      { text: "Contact journalist, PGP handoff.", nextSceneId: "reykjavik_upload_journalist_pgp", privacyScoreEffect: 4, feedback: "Decent choice. +4 Score." },
      { text: "Public Wi-Fi, quick upload.", nextSceneId: "reykjavik_upload_public_wifi_fast", privacyScoreEffect: -12, feedback: "Still very risky. -12 Score." }
    ]
  },
  'reykjavik_upload_tor_platforms': {
    id: 'reykjavik_upload_tor_platforms',
    locationTitle: "Reykjavik: Uploading via Tor",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik laptop Tor browser upload",
    narrative: "Using Tor, you begin uploading the massive trove of data to several whistleblowing platforms. It's slow, agonizing.\n\nSuddenly, your connection flickers. DDoS attack? Or is NovaGen trying to trace you?",
    choices: [
      { text: "Persist with the upload, find alternative Tor exit nodes.", nextSceneId: "reykjavik_upload_complete_check_score", privacyScoreEffect: 5, feedback: "Perseverance! +5 Score." },
      { text: "Abort, switch to a different secure location and try again.", nextSceneId: "reykjavik_switch_location_retry_upload", privacyScoreEffect: 3, feedback: "Cautious. +3 Score." },
      { text: "Too risky. Attempt a quick, less anonymous upload to just one platform.", nextSceneId: "reykjavik_upload_quick_single_panic", privacyScoreEffect: -5, feedback: "Panic move, less impact, more risk. -5 Score."} 
    ]
  },
  'reykjavik_upload_journalist_pgp': {
    id: 'reykjavik_upload_journalist_pgp',
    locationTitle: "Reykjavik: Journalist Handoff",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik encrypted email journalist",
    narrative: "You contact the investigative journalist. After verifying your identity (and yours, them), you PGP-encrypt the data and send it via a secure channel.\n\nThey confirm receipt and promise to start verification immediately. 'The world will know,' they assure you.",
    choices: [
      { text: "Trust the journalist. The story will break soon.", nextSceneId: "reykjavik_upload_complete_check_score", privacyScoreEffect: 5, feedback: "Good choice, professional handling. +5 Score." }
    ]
  },
  'reykjavik_upload_public_wifi_fast': {
    id: 'reykjavik_upload_public_wifi_fast',
    locationTitle: "Reykjavik: Public Wi-Fi Upload",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik cafe public wifi risky",
    narrative: "You find a busy cafe and use their public Wi-Fi for a quick upload to a pastebin-style site. It's fast, but your IP is exposed, and the link could be taken down quickly.\n\nAs you hit send, a news alert pops up: 'NovaGen CEO announces breakthrough in... data security?' They know.",
    choices: [
      { text: "Hope the data spreads before it's scrubbed. Disappear.", nextSceneId: "reykjavik_upload_complete_check_score", privacyScoreEffect: -15, feedback: "Massive personal risk, data might not stick. -15 Score.", setsFlags: ["self_exposed_reykjavik"] }
    ]
  },
  'reykjavik_switch_location_retry_upload': {
    id: 'reykjavik_switch_location_retry_upload',
    locationTitle: "Reykjavik: New Upload Point",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik new secure location upload",
    narrative: "You quickly pack up and move to a different pre-arranged secure location.\n\nThe connection here is stable. You resume the Tor upload.",
    choices: [
      { text: "Continue upload.", nextSceneId: "reykjavik_upload_complete_check_score", privacyScoreEffect: 3, feedback: "Good adaptability. +3 Score." }
    ]
  },
  'reykjavik_upload_quick_single_panic': {
    id: 'reykjavik_upload_quick_single_panic',
    locationTitle: "Reykjavik: Panic Upload",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik panic upload screen",
    narrative: "In a panic, you switch to a direct, less anonymous upload to a single major news aggregator.\n\nIt's fast, but highly traceable. The files are up. For now.",
    choices: [
      { text: "The dice is cast. Hope for the best.", nextSceneId: "reykjavik_upload_complete_check_score", privacyScoreEffect: -10, feedback: "Data is out, but you're exposed. -10 Score.", setsFlags: ["self_exposed_reykjavik"]}
    ]
  },
  'reykjavik_upload_complete_check_score': {
    id: 'reykjavik_upload_complete_check_score',
    locationTitle: "Reykjavik: Upload Complete",
    image: "https://i.ibb.co/BKsGJYX1/reykyjavik-iceland.jpg",
    imageHint: "Reykjavik success screen quiet",
    narrative: "The upload is complete. The evidence against NovaGen is now in the wild or with trusted journalists.\n\nAll you can do is wait and see the fallout, and hope your own tracks are covered.",
    isGameOver: false, 
    choices: [
      { text: "Await the world's reaction...", nextSceneId: "final_outcome_evaluation" }
    ]
  },
  'final_outcome_evaluation': {
    id: 'final_outcome_evaluation',
    locationTitle: "The Aftermath",
    image: "https://i.ibb.co/bGdSqfy/biotech-firm-novagen-in-the-background-an-eery-om.jpg",
    imageHint: "news montage success",
    narrative: "The dust settles. Your actions have consequences...",
    isGameOver: true, 
    choices: [{ text: "Reflect and Restart", nextSceneId: INITIAL_SCENE_ID}]
  },


  // --- GAME OVER SCENES ---
  'gameOver_win_standard': {
    id: 'gameOver_win_standard',
    locationTitle: "VICTORY!",
    image: "https://i.ibb.co/cXL0nQhL/shutdown.png", 
    imageHint: "news headlines victory",
    isGameOver: true,
    isWin: true,
    narrative: "SUCCESS! Your exposé, backed by irrefutable evidence, has brought NovaGen to its knees. Stock prices plummet, government investigations are launched, and victims are finding justice. Lynx messages you: 'We did it. Thank you. The world is safer because of you.'\n\nYour privacy skills saved the day!",
    gameOverMessage: "NovaGen EXPOSED! You successfully navigated the digital shadows and revealed the truth. Your sources are safe. Well done, Detective!",
    choices: [ { text: "Play Again?", nextSceneId: INITIAL_SCENE_ID } ]
  },
  'gameOver_win_perfect': {
    id: 'gameOver_win_perfect',
    locationTitle: "FLAWLESS VICTORY!",
    image: "https://i.ibb.co/cXL0nQhL/shutdown.png", 
    imageHint: "global celebration privacy award",
    isGameOver: true,
    isWin: true,
    narrative: "PERFECTION! Your flawless execution of the mission not only exposed NovaGen but has sparked global reforms in corporate oversight and data privacy. NovaGen is completely dismantled. You're a legend in the whistleblower community. Lynx is eternally grateful and safe.\n\nYour mastery of privacy is unparalleled!",
    gameOverMessage: "FLAWLESS OPERATION! NovaGen dismantled, global privacy reforms enacted. You're a hero!",
    choices: [ { text: "Play Again?", nextSceneId: INITIAL_SCENE_ID } ]
  },
  'gameOver_lose_caught_early': {
    id: 'gameOver_lose_caught_early',
    locationTitle: "GAME OVER - Captured",
    image: "https://i.ibb.co/LDrFmkNq/a_shot_of_a_berlin_graveyard.jpg",
    imageHint: "prison cell shadow graveyard",
    isGameOver: true,
    isWin: false,
    narrative: "Your misstep was fatal. NovaGen's security forces were waiting. They apprehended you, and all your data was seized.\n\nLynx's fate is unknown. NovaGen's secrets remain buried.",
    gameOverMessage: "Captured by NovaGen. Your investigation ends here. Mission Failed.",
    choices: [ { text: "Try Again?", nextSceneId: INITIAL_SCENE_ID } ]
  },
  'gameOver_lose_lynx_compromised': {
    id: 'gameOver_lose_lynx_compromised',
    locationTitle: "GAME OVER - Source Lost",
    image: "https://i.ibb.co/LDrFmkNq/a_shot_of_a_berlin_graveyard.jpg",
    imageHint: "empty dark room graveyard evidence",
    isGameOver: true,
    isWin: false,
    narrative: "Your actions led to Lynx being captured by NovaGen. Without your primary source, the critical evidence is lost forever.\n\nNovaGen's crimes continue, unexposed.",
    gameOverMessage: "Lynx was compromised due to your actions. The mission is a failure.",
    choices: [ { text: "Try Again?", nextSceneId: INITIAL_SCENE_ID } ]
  },
  'gameOver_lose_insufficient_evidence': {
    id: 'gameOver_lose_insufficient_evidence',
    locationTitle: "GAME OVER - Evidence Incomplete",
    image: "https://i.ibb.co/LDrFmkNq/a_shot_of_a_berlin_graveyard.jpg",
    imageHint: "shredded documents graveyard desk",
    isGameOver: true,
    isWin: false,
    narrative: "You managed to publish something, but the core evidence was locked, lost, or insufficient. NovaGen's PR team easily discredited your story.\n\nThe world moves on, unaware of the truth.",
    gameOverMessage: "Your exposé lacked the critical proof. NovaGen weathered the storm. Mission Failed.",
    choices: [ { text: "Try Again?", nextSceneId: INITIAL_SCENE_ID } ]
  },
  'gameOver_lose_exposed_during_upload': {
    id: 'gameOver_lose_exposed_during_upload',
    locationTitle: "GAME OVER - Traced and Silenced",
    image: "https://i.ibb.co/LDrFmkNq/a_shot_of_a_berlin_graveyard.jpg",
    imageHint: "door kicked in graveyard night",
    isGameOver: true,
    isWin: false,
    narrative: "Your insecure upload from Reykjavik was traced. Just as the story began to make waves, NovaGen operatives (or authorities working with them) found you.\n\nThe data was scrubbed, and you were silenced. A tragic end.",
    gameOverMessage: "You were traced during the upload. NovaGen silenced you and the story. Mission Failed.",
    choices: [ { text: "Try Again?", nextSceneId: INITIAL_SCENE_ID } ]
  },
  'gameOver_lose_aborted_mission_C': {
    id: 'gameOver_lose_aborted_mission_C',
    locationTitle: "GAME OVER - Mission Aborted",
    image: "https://i.ibb.co/LDrFmkNq/a_shot_of_a_berlin_graveyard.jpg",
    imageHint: "lone figure walking away graveyard city",
    isGameOver: true,
    isWin: false,
    narrative: "The challenges in Amsterdam proved too great. Unable to secure or decrypt the final evidence, you were forced to abort the mission.\n\nNovaGen continues its operations, its secrets safe.",
    gameOverMessage: "Mission aborted in Amsterdam. The risks became too high. NovaGen wins this round.",
    choices: [ { text: "Try Again?", nextSceneId: INITIAL_SCENE_ID } ]
  },
   'gameOver_lose_metadata_fail': {
    id: 'gameOver_lose_metadata_fail',
    locationTitle: "GAME OVER - Critical Data Leak",
    image: "https://i.ibb.co/LDrFmkNq/a_shot_of_a_berlin_graveyard.jpg",
    imageHint: "data leak server graveyard red alert",
    isGameOver: true,
    isWin: false,
    narrative: "Your failure to properly redact sensitive metadata from the evidence files had catastrophic consequences. NovaGen traced the leaks back to your sources, including Lynx.\n\nThey were silenced before the full story could have maximum impact. Your carelessness cost lives and the mission.",
    gameOverMessage: "Critical metadata leak! Your sources were exposed due to improper redaction. Mission Failed.",
    choices: [ { text: "Try Again?", nextSceneId: INITIAL_SCENE_ID } ]
  },
  // Placeholder scenes to prevent "Scene not found" errors during development
  cityA_Viktoriapark_Diversion: {
    id: 'cityA_Viktoriapark_Diversion',
    locationTitle: 'Berlin: Viktoriapark - Diversion Attempt',
    image: 'https://i.ibb.co/WpyNwfvD/a_shot_of_viktoria_park_berlin.png',
    imageHint: 'park distraction Viktoriapark',
    narrative: 'You attempt a diversion. It creates some confusion.\n\nDid it work well enough to approach the dead drop at the fountain?',
    choices: [
      { text: 'Yes, go for the USB now.', nextSceneId: 'berlin_viktoriapark_retrieve_success', privacyScoreEffect: 3, setsFlags: ['usb_A_retrieved'] },
      { text: 'No, too risky. Abort and contact Lynx.', nextSceneId: 'berlin_contact_lynx_alternative_A', privacyScoreEffect: 1 },
    ],
  },
  cityA_MoreBerlinIntel: {
    id: 'cityA_MoreBerlinIntel',
    locationTitle: 'Berlin: More Intel',
    image: 'https://i.ibb.co/kWb0wkx/homebase.png',
    imageHint: "Berlin data analysis",
    narrative: 'You delve deeper into local Berlin intel on NovaGen. You uncover mentions of unusual shipments to a subsidiary in Prague.\n\nThis could be where they are conducting more sensitive parts of their research, away from direct scrutiny in Berlin.',
    choices: [
      { text: 'Prepare to leave for Prague.', nextSceneId: 'prague_travel_immediate' },
      { text: 'Ignore this lead and focus on Berlin for now.', nextSceneId: 'berlin_focus_local', privacyScoreEffect: -5, feedback: "Ignoring a strong lead could be a mistake." },
      { text: 'Try to verify Prague lead with Lynx.', nextSceneId: 'berlin_verify_prague_lead_lynx', privacyScoreEffect: 2 }
    ],
  },
  'berlin_verify_prague_lead_lynx': {
    id: 'berlin_verify_prague_lead_lynx',
    locationTitle: "Berlin: Verifying Prague Lead",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "secure comms Lynx Berlin",
    narrative: "You contact Lynx about the Prague subsidiary. Lynx confirms: 'Yes, that's where the core research happens. If you can get evidence from there, it would be damning. But it's heavily guarded.'",
    choices: [
        { text: "Prague it is. Time to prepare.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: 3, feedback: "Lead confirmed. +3 Score."}
    ]
  },
  'berlin_focus_local': {
    id: 'berlin_focus_local',
    locationTitle: 'Berlin: Focusing Locally',
    image: 'https://i.ibb.co/kWb0wkx/homebase.png',
    imageHint: 'Berlin intense research',
    narrative: "You decide to ignore the Prague lead for now, hoping for a breakthrough in Berlin. Days pass, but NovaGen's local operations are tight.\n\nLynx messages again, more urgently: 'Berlin is a dead end for physical proof. The trail leads to Prague. I can't wait much longer.'",
    choices: [
      { text: 'Heed Lynx\'s warning. Prepare for Prague.', nextSceneId: 'prague_travel_immediate' },
      { text: 'Try one last high-risk attempt to infiltrate NovaGen Berlin.', nextSceneId: 'berlin_infiltrate_hq_attempt', privacyScoreEffect: -5, feedback: "Very risky." }
    ]
  },
  'berlin_infiltrate_hq_attempt': {
    id: 'berlin_infiltrate_hq_attempt',
    locationTitle: "Berlin: NovaGen HQ Infiltration",
    image: "https://i.ibb.co/bGdSqfy/biotech-firm-novagen-in-the-background-an-eery-om.jpg",
    imageHint: "NovaGen security checkpoint",
    narrative: "Your attempt to infiltrate NovaGen's Berlin HQ is quickly thwarted by their high-tech security and vigilant guards.\n\nYou barely escape detection. It's clear Berlin is locked down.",
    choices: [
        { text: "Abort Berlin operations. Head to Prague.", nextSceneId: "prague_travel_immediate_urgent", privacyScoreEffect: -3, feedback: "Failed infiltration, lucky escape. -3 Score."}
    ]
  },
  cityA_IndependentResearch: {
    id: 'cityA_IndependentResearch',
    locationTitle: 'Berlin: Independent Research',
    image: 'https://i.ibb.co/kWb0wkx/homebase.png',
    imageHint: "Berlin library research",
    narrative: 'Your independent research into NovaGen uncovers connections to shell corporations operating out of Prague, known for lax regulatory oversight.\n\nLynx confirms this is where the next stage of evidence might be found.',
    choices: [
      { text: 'This points towards Prague. Time to go.', nextSceneId: 'prague_travel_immediate' },
      { text: 'Try to find more direct evidence in Berlin before leaving.', nextSceneId: 'berlin_seek_direct_evidence', privacyScoreEffect: -2, feedback: "Lynx's intel suggests Prague is key." },
      { text: 'Share findings with an investigative journalist for collaboration.', nextSceneId: 'berlin_share_journalist_research', privacyScoreEffect: 1, feedback: "Collaboration could be useful." }
    ],
  },
  'berlin_share_journalist_research': {
    id: 'berlin_share_journalist_research',
    locationTitle: "Berlin: Contacting Journalist",
    image: "https://i.ibb.co/kWb0wkx/homebase.png",
    imageHint: "PGP email journalist",
    narrative: "You securely share your initial findings about the Prague shell corporations with a trusted investigative journalist. They are intrigued and promise to look into it from their end, potentially providing corroborating evidence later.\n\nFor now, your best bet is still to follow Lynx's leads.",
    choices: [
      { text: "Prague seems the next logical step.", nextSceneId: "prague_travel_immediate", privacyScoreEffect: 2, feedback: "Journalist contact established. +2 Score.", setsFlags: ["journalist_contacted_berlin"]}
    ]
  },
  'berlin_seek_direct_evidence': {
    id: 'berlin_seek_direct_evidence',
    locationTitle: 'Berlin: Seeking Direct Evidence',
    image: 'https://i.ibb.co/kWb0wkx/homebase.png',
    imageHint: 'Berlin surveillance equipment',
    narrative: "You try to find more direct evidence in Berlin, but NovaGen's security is formidable. You waste valuable time and narrowly avoid a NovaGen security sweep near one of their facilities.\n\nLynx messages: 'Prague is where the next crucial data lies. Berlin is too hot now.'",
    choices: [
      { text: 'Cut losses. Head to Prague.', nextSceneId: 'prague_travel_immediate' },
      { text: 'Attempt to plant a listening device near NovaGen HQ (very risky).', nextSceneId: 'berlin_plant_bug_attempt', privacyScoreEffect: -5, feedback: "Extremely high risk. -5 Score."}
    ]
  },
  'berlin_plant_bug_attempt': {
    id: 'berlin_plant_bug_attempt',
    locationTitle: "Berlin: Planting a Bug",
    image: "https://i.ibb.co/bGdSqfy/biotech-firm-novagen-in-the-background-an-eery-om.jpg",
    imageHint: "security camera night street",
    narrative: "Your attempt to plant a listening device near NovaGen HQ fails. Their counter-surveillance tech detects your device almost immediately.\n\nYou have to abort and flee, lucky not to be caught.",
    choices: [
        { text: "Berlin is too dangerous now. Flee to Prague.", nextSceneId: "prague_travel_immediate_urgent", privacyScoreEffect: -3, feedback: "Failed attempt, exposed presence. -3 Score."}
    ]
  },
  cityB_Prague_BurnerSIM: {
    id: 'cityB_Prague_BurnerSIM',
    locationTitle: 'Prague: Burner SIM Acquired',
    image: 'https://i.ibb.co/pv8kcJPh/prague-czech-republic.jpg',
    imageHint: "Prague phone shop",
    narrative: 'You successfully acquire a pre-paid burner SIM card in Prague. This gives you a secure, untraceable local communication line.\n\nLynx had mentioned a meet-up at the Old Town kiosk. How do you proceed?',
    choices: [
      { text: 'Scout Old Town kiosk before meet time.', nextSceneId: 'prague_oldtown_scout', privacyScoreEffect: 5 },
      { text: 'Head directly to Old Town kiosk at meet time.', nextSceneId: 'prague_oldtown_direct_meet', privacyScoreEffect: -5 },
      { text: 'Use the burner to try and re-establish contact with Lynx for confirmation.', nextSceneId: 'prague_contact_lynx_burner_B', privacyScoreEffect: 2 }
    ],
  },
  'prague_contact_lynx_burner_B': {
    id: 'prague_contact_lynx_burner_B',
    locationTitle: 'Prague: Contacting Lynx via Burner',
    image: 'https://i.ibb.co/pv8kcJPh/prague-czech-republic.jpg',
    imageHint: 'Prague burner phone call alley',
    narrative: "You use the new burner SIM to send a coded message to Lynx. Lynx responds quickly:\n'Good. You're being careful. Yes, Old Town kiosk, meet time sharp. I have critical files. They are watching, though. Be discreet.'",
    choices: [
      { text: 'Proceed to scout Old Town kiosk.', nextSceneId: 'prague_oldtown_scout', privacyScoreEffect: 3},
      { text: 'Acknowledge and go directly to the meet.', nextSceneId: 'prague_oldtown_direct_meet', privacyScoreEffect: -3},
      { text: "Suggest an alternative, less public meet spot.", nextSceneId: "prague_suggest_alt_meet_B", privacyScoreEffect: 1}
    ]
  },
  'prague_suggest_alt_meet_B': {
    id: 'prague_suggest_alt_meet_B',
    locationTitle: "Prague: Suggesting New Meet Spot",
    image: "https://i.ibb.co/pv8kcJPh/prague-czech-republic.jpg",
    imageHint: "Prague map planning",
    narrative: "You suggest a quieter, less conspicuous location to Lynx for the meet. Lynx replies:\n'No good. Kiosk is already set. Changing now draws more attention. Stick to the plan, but be smart.'",
    choices: [
        { text: "Understood. Will scout the kiosk.", nextSceneId: "prague_oldtown_scout", privacyScoreEffect: 1, feedback: "Lynx insists on plan. +1 Score."}
    ]
  },
  cityB_Prague_OldTownSquare_Scout: {
    id: 'cityB_Prague_OldTownSquare_Scout',
    locationTitle: "Prague: Old Town Square Recon",
    image: "https://i.ibb.co/HDcn334N/a_shot_of_old_town_square_prague.jpg",
    imageHint: "Prague Old Town Square surveillance",
    narrative: "You spend an hour scouting Old Town Square. It's bustling with tourists. You notice a few individuals near the kiosk who seem out of place—too watchful, too focused.\n\nLikely NovaGen surveillance.",
    choices: [
      { text: "Attempt the meet, but have an escape route planned.", nextSceneId: "prague_oldtown_meet_watched", privacyScoreEffect: -3, feedback: "Risky, but you're prepared. -3 Score." },
      { text: "Try to signal Lynx discreetly that the area is hot.", nextSceneId: "prague_signal_lynx_abort", privacyScoreEffect: 2, feedback: "Protecting your source. +2 Score." },
      { text: "Create a diversion to pull watchers away from the kiosk.", nextSceneId: "prague_oldtown_diversion", privacyScoreEffect: 0, feedback: "Could work, or escalate things." }
    ]
  },
};

