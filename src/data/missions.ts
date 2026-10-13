export interface SensoryMission {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  sensoryFocus: 'Sight' | 'Sound' | 'Touch' | 'Breath' | 'Presence';
  description: string;
  guidanceSteps: string[];
  voiceIntro: string;
  recommendedTime: 'Morning' | 'Anytime' | 'Sunset' | 'Afternoon';
}

export const CURATED_MISSIONS: SensoryMission[] = [
  {
    id: 'canopy-gaze',
    title: 'The Canopy & Horizon Gaze',
    subtitle: 'Relieve optical screen fatigue by shifting to infinity focus',
    durationMinutes: 15,
    sensoryFocus: 'Sight',
    description: 'Looking at screens locks our ciliary eye muscles into a fixed 40-centimeter range. Step outside and intentionally look past the nearest building or treetop to the horizon.',
    guidanceSteps: [
      'Slip your phone into your pocket and begin an easy, unhurried walk.',
      'Every 50 paces, look up into the tree canopy or cloud formations for 10 seconds.',
      'Notice shades of green, amber, and sky blue that no display can replicate.',
      'Breathe out through slightly parted lips and let your peripheral vision expand.',
    ],
    voiceIntro: 'Put your phone in your pocket. As we walk, let your gaze wander up into the open sky and tree branches. Soften your eyes.',
    recommendedTime: 'Anytime',
  },
  {
    id: 'five-senses-grounding',
    title: '5-Senses Nature Grounding',
    subtitle: 'Re-anchor your nervous system in physical reality',
    durationMinutes: 20,
    sensoryFocus: 'Presence',
    description: 'A tactile stroll designed to pull mental overstimulation back down into your feet, hands, and breath.',
    guidanceSteps: [
      'Start walking without checking any notifications.',
      'Name 5 textures around you (rough tree bark, cool stone, soft moss, textured sidewalk).',
      'Listen for 4 distinct layers of natural sound.',
      'Sense 3 physical sensations (wind on your neck, warmth of the sun, foot strike).',
      'Breathe in 2 distinct outdoor scents (damp earth, pine, fresh rain, dry leaves).',
      'Feel 1 deep sensation of gratitude for stepping out the door.',
    ],
    voiceIntro: 'Welcome outside. Slide your phone into your pocket. Walk gently, and let your five senses lead the way.',
    recommendedTime: 'Anytime',
  },
  {
    id: 'wind-and-soundscape',
    title: 'Wind & Natural Soundscape',
    subtitle: 'Tune into acoustic textures beyond synthetic digital notifications',
    durationMinutes: 12,
    sensoryFocus: 'Sound',
    description: 'Close your mental tabs. Use your ears as high-fidelity microphones tuning into natural acoustic patterns.',
    guidanceSteps: [
      'Pocket your device and set a steady walking pace.',
      'Focus your auditory attention on the furthest sound you can hear—a distant bird, rustling branches.',
      'Now shift focus to the nearest sound: the gentle rustle of your clothes and rhythm of your shoes.',
      'Notice how the outdoor world breathes without urgency.',
    ],
    voiceIntro: 'Keep your phone tucked safely away. Open your ears to the subtle layers of wind, birds, and leaves.',
    recommendedTime: 'Morning',
  },
  {
    id: 'rhythm-of-footsteps',
    title: 'Cadence of Footsteps',
    subtitle: 'Synchronize 4-step nasal breathing with physical movement',
    durationMinutes: 15,
    sensoryFocus: 'Breath',
    description: 'Digital screen work induces shallow, irregular breath ("screen apnea"). This stroll pairs bilateral walking movement with deep diaphragmatic breath.',
    guidanceSteps: [
      'Inhale softly through your nose for 4 walking paces.',
      'Exhale smoothly through your mouth for 4 walking paces.',
      'Feel your shoulders drop down away from your ears.',
      'Let your arms swing naturally without holding anything.',
    ],
    voiceIntro: 'Hands free, phone in your pocket. Match your breath to the rhythm of your steps: four paces in, four paces out.',
    recommendedTime: 'Afternoon',
  },
  {
    id: 'circadian-sunlight-soak',
    title: 'Natural Light Lux Soak',
    subtitle: 'Reset circadian rhythms and dopamine receptors in daylight',
    durationMinutes: 15,
    sensoryFocus: 'Sight',
    description: 'Indoor lighting is typically 200–500 lux; natural outdoor sunlight even on an overcast day exceeds 10,000–50,000 lux. Soak in photons to reset natural energy.',
    guidanceSteps: [
      'Step out under open sky without wearing sunglasses for at least 10 minutes if comfortable.',
      'Do not look directly at the sun; look slightly offset at the sky dome.',
      'Feel the natural temperature on your cheeks and forehead.',
      'Let the natural photon bath signal vitality to your biological clock.',
    ],
    voiceIntro: 'Step out into the daylight. Let the natural brightness wake up your body and clear away mental fog.',
    recommendedTime: 'Morning',
  },
  {
    id: 'neighborhood-micro-safari',
    title: 'Micro-Nature Safari',
    subtitle: 'Discover tiny living ecosystems thriving in urban spaces',
    durationMinutes: 18,
    sensoryFocus: 'Presence',
    description: 'Even in concrete neighborhoods, nature perseveres: moss in brick crevices, wildflowers in pavement seams, ants charting stone trails.',
    guidanceSteps: [
      'Stroll slowly along your usual route with fresh curiosity.',
      'Find 3 resilient plants or insects flourishing where humans did not plant them.',
      'Appreciate the persistent vitality of living organisms.',
      'Notice how taking your mind off work creates spontaneous clarity.',
    ],
    voiceIntro: 'Look closely at the edges of the sidewalk and garden fences. Notice what life is quietly growing around you.',
    recommendedTime: 'Anytime',
  },
];
