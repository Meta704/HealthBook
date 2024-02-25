import Sound from 'react-native-sound';

class Sounds {
  private static sounds: Record<string, Sound> = {

    ding: new Sound(require('../assets/audio/ding.wav'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load ding sound', error);
      }
    }),

    welcome: new Sound(require('../assets/audio/welcome.wav'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load welcome sound', error);
      }
    }),

    success: new Sound(require('../assets/audio/success.wav'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load success sound', error);
      }
    }),

    switch: new Sound(require('../assets/audio/switch.wav'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load switch sound', error);
      }
    }),

    error: new Sound(require('../assets/audio/error.wav'), Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load error sound', error);
      }
    }),

  };

  static playSound = (soundName: string) => {
    const sound = Sounds.sounds[soundName];
    if (sound) {
      sound.play((success) => {
        if (!success) {
          console.log(`Failed to play ${soundName} sound`);
        }
      });
    }
  };
}

export default Sounds;
