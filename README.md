
![Iron Hero](assets/images/IronHero.png)

This project is a rhythm-based video game where the player must hit musical notes in sync with a song, inspired by Guitar Hero. Developed with **JavaScript**, **HTML**, and **CSS**, the game includes key detection, visual effects for hits and misses, and an intuitive interface for an immersive user experience. 

Throughout this project, **DOM manipulation** plays a crucial role, allowing dynamic updates to the game screen, such as adding and removing notes, displaying scores in real time, and visually marking hit zones for successful or missed notes. These elements enhance interactivity and provide immediate feedback, creating a more engaging experience for the player.

## Game Features

- **Gameplay Mechanics**: Notes fall down columns on the screen, and the player must press the corresponding key (A, S, D, F, G) at the right moment to hit them.
- **Scoring System**: Each hit adds points to the player’s score, while a missed note increments a fail counter. If the player misses too many notes, the game ends.
- **Pause and Resume**: The game can be paused, offering options to resume, restart, or exit.
- **Game Screens**: Includes main menu, gameplay screen, and end screen.
- **Score and Accuracy Display**: At the end of the game, the final score and the player's accuracy are shown.

## File Structure

The project is divided into several files for modularity:

- **index.html**: Contains the game’s HTML structure.
- **style.css**: Defines the visual style of the user interface.
- **index.js**: The main file that initializes and controls the game flow.
- **game.js**: Contains the `Game` class and core game logic.
- **note.js**: Defines the `Note` class, which represents each musical note.
- **track.js**: Defines the track of notes, with timings and corresponding keys.
- **constants.js**: Stores game constants such as key codes and scoring values.

## Game Instructions

1. **Main Screen**: When you launch the game, you’ll see the main screen. Click the start button to begin.
2. **Game Keys**: Use the **A**, **S**, **D**, **F**, and **G** keys to hit the notes as they fall:
   - **A**: Leftmost column (red).
   - **S**: Second column (green).
   - **D**: Center column (yellow).
   - **F**: Fourth column (blue).
   - **G**: Rightmost column (orange).
3. **Hits and Misses**: If you hit a note, points are added to your score; if you miss, the miss counter increases. Too many misses will end the game.
4. **Pause/Resume**: Press the pause key (specified on your keyboard) to pause the game. In the pause menu, you can resume, restart, or exit.
5. **Game End**: The end screen displays the final score and hit accuracy.

## Customization

The **track.js** file can be modified to change the sequence of notes and sync them with a specific song. Each note includes a timestamp and the key the player must press.

## Example Note Configuration in `track.js`

```javascript
const track = [
    { time: 1000, key: KEY_A },
    { time: 2000, key: KEY_S },
    { time: 3000, key: KEY_D },
    { time: 4000, key: KEY_F },
    { time: 5000, key: KEY_G },
    // Add more notes according to the song
];
```

## Future Improvements

- **Difficulty Levels**: Implement difficulty levels to vary the note speed.
- **Combo System**: Add a combo system to reward consecutive hits.
- **Sound Effects**: Incorporate sounds for hits and misses for a more immersive experience.