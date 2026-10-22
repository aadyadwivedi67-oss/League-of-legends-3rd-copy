# ⚔️ RIFTBOUND: Arena Clash

**Enter the Rift. Master your abilities. Defeat the enemy.**

RIFTBOUND: Arena Clash is a browser-based fantasy arena battle game inspired by Multiplayer Online Battle Arena (MOBA) games like League of Legends. Built with HTML, CSS, and vanilla JavaScript, it brings fast-paced combat, enemy AI, magical abilities, and a fantasy battlefield directly to your browser.

No downloads. No game engine. No Ollama. Just open the game and play.

## 🎮 Game Preview

*Enter a fantasy arena, control your champion, dodge enemy attacks, and eliminate three enemy champions to claim victory.*

## ✨ Features

- **Fantasy Battle Arena:** Explore a top-down battlefield with grass, stone lanes, magical rivers, and glowing crystals.
- **Champion Movement:** Navigate the arena using WASD or the arrow keys.
- **Basic Combat:** Aim with your mouse and fire magical projectiles at enemies.
- **Arcane Burst Ability:** Use your Q ability to deal area damage to nearby enemies.
- **Enemy AI:** Enemies chase your champion and launch projectiles.
- **Health System:** Track your health and avoid defeat.
- **Victory and Defeat Screens:** Win by eliminating all three enemies or lose when your health reaches zero.
- **Responsive Interface:** A fantasy-inspired HUD with health bars, ability cooldowns, and battle statistics.
- **Instant Restart:** Jump back into battle without refreshing the page.

## 🕹️ Controls

| Input | Action |
|---|---|
| `W` / `↑` | Move up |
| `A` / `←` | Move left |
| `S` / `↓` | Move down |
| `D` / `→` | Move right |
| Mouse | Aim |
| Left Click | Basic attack |
| `Q` | Activate Arcane Burst |
| Restart Button | Start a new battle |

## 🛠️ Built With

- **HTML5** — Game structure and interface
- **CSS3** — Styling, layout, and responsive design
- **JavaScript** — Game loop, movement, combat, collision detection, enemy AI, and particle effects
- **HTML Canvas API** — Rendering the arena, champions, projectiles, and visual effects

No backend, external game engine, AI model, or API key is required.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

Replace `YOUR_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Open the project folder

```bash
cd riftbound-arena
```

### 3. Launch the game

Open `index.html` in your browser.

Alternatively, use the **Live Server** extension in Visual Studio Code for local development.

That's it! You're ready to enter the Rift.

## 📁 Project Structure

```text
riftbound-arena/
├── index.html    # Game interface
├── style.css     # Visual design and layout
├── game.js       # Game engine and combat logic
└── README.md     # Project documentation
```

## 🧠 How It Works

**Game Loop:** JavaScript's `requestAnimationFrame()` continuously updates the game world and renders each frame.

**Player Movement:** Keyboard input controls the champion's movement, with normalized diagonal movement and arena boundaries.

**Combat System:** Mouse aiming determines projectile direction. Collision detection determines whether projectiles hit enemies or the player.

**Enemy AI:** Enemies pursue the player, maintain distance, and launch attacks when the player is within range.

**Arcane Burst:** The Q ability damages all enemies within its effective radius and triggers a visual magic effect.

**Game State:** The game tracks health, eliminations, cooldowns, victory, and defeat.

## 🌱 Future Improvements

This is an early playable prototype, with plenty of room to grow:

- [ ] Add friendly and enemy minion waves.
- [ ] Add defensive towers and destructible objectives.
- [ ] Introduce multiple playable champions.
- [ ] Build an item shop and gold economy.
- [ ] Add experience, leveling, and additional abilities.
- [ ] Improve enemy pathfinding and combat behavior.
- [ ] Add sound effects, music, and champion animations.
- [ ] Implement a minimap and team objectives.
- [ ] Explore online multiplayer functionality.

## 🤝 Contributing

Contributions and suggestions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request describing your improvements.

Ideas for new abilities, enemy behaviors, visual effects, and gameplay mechanics are especially welcome.

## 📜 License

This project can be released under the MIT License. If you choose MIT, add a `LICENSE` file containing the appropriate license text before distributing the project under that license.

## ⚠️ Disclaimer

RIFTBOUND: Arena Clash is an independent, fan-inspired project. It is not affiliated with, endorsed by, or associated with Riot Games or League of Legends. All original project code and assets should be distinguished from third-party trademarks and intellectual property.

---

**⚔️ The Rift awaits. Are you ready to fight?**
