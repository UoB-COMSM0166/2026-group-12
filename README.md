
# 2026-group-12
2026 COMSM0166 group 12

# COMSM0166 Project Template
A project template for the Software Engineering Discipline and Practice module (COMSM0166).

## Info

This is the template for your group project repo/report. We'll be setting up your repo and assigning you to it after the group forming activity. You can delete this info section, but please keep the rest of the repo structure intact.

You will be developing your game using [P5.js](https://p5js.org) a javascript library that provides you will all the tools you need to make your game. However, we won't be teaching you javascript, this is a chance for you and your team to learn a (friendly) new language and framework quickly, something you will almost certainly have to do with your summer project and in future. There is a lot of documentation online, you can start with:

- [P5.js tutorials](https://p5js.org/tutorials/) 
- [Coding Train P5.js](https://thecodingtrain.com/tracks/code-programming-with-p5-js) course - go here for enthusiastic video tutorials from Dan Shiffman (recommended!)

## Your Game (change to title of your game)

STRAPLINE. Add an exciting one sentence description of your game here.

IMAGE. Add an image of your game here, keep this updated with a snapshot of your latest development.

LINK. Add a link here to your deployed game, you can also make the image above link to your game if you wish. Your game lives in the [/docs](/docs) folder, and is published using Github pages. 

VIDEO. Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)

## Your Group

<p align="center">
  <img src="image/GroupPhoto.jpeg" width="600">
</p>

<table align="center">
  <tr>
    <th>Member</th>
    <th>Email</th>
    <th>Github</th>
    <th>Role</th>
  </tr>
  <tr>
    <td>Ming Wei</td>
    <td>ri25947@bristol.ac.uk</td>
    <td>wming18082721229</td>
    <td>Project Manager / Frontend Engineer / Developer</td>
  </tr>
  <tr>
    <td>Jay-Sin Chiu</td>
    <td>ob25847@bristol.ac.uk</td>
    <td>jess1115</td>
    <td>Project Manager / Frontend Engineer / Developer</td>
  </tr>
  <tr>
    <td>Yi-Hsin Peng</td>
    <td>dq25826@bristol.ac.uk</td>
    <td>pphsin</td>
    <td>Game Systems Architect / Developer</td>
  </tr>
  <tr>
    <td>Hsun-Han Huang</td>
    <td>sf25156@bristol.ac.uk</td>
    <td>bill1122y</td>
    <td>Game Systems Architect / Developer</td>
  </tr>
  <tr>
    <td>Yu-Cheng Cheng</td>
    <td>ej25196@bristol.ac.uk</td>
    <td>chuckyu1012</td>
    <td>Game Systems Architect / Developer</td>
  </tr>
  <tr>
    <td>Ming-Yen Tsai</td>
    <td>az25406@bristol.ac.uk</td>
    <td>marty12211</td>
    <td>QA & Optimization Engineer / Developer</td>
  </tr>
</table>


## Project Report
[Kanban link](https://trello.com/invite/b/698ac34dda403c044906233f/ATTI4db26394399c57af543af31092c66765564157A4/my-trello-board)
## Introduction

- 5% ~250 words 
- Describe your game, what is based on, what makes it novel? (what's the "twist"?) 

## Requirements 

- 15% ~750 words
- Early stages design. Ideation process. How did you decide as a team what to develop? Use case diagrams, user stories.

### Ideation process

Early Stage Design & Ideation process At the beginning, our team initiated the design process by compiling a list of game references that each of the six team members was personally interested in. In total, we brought together 10 different games for consideration. presentation. During our initial meeting, we presented our selected games to the group, sharing not only the genre and mechanics of each game, but also the core ideas and unique aspects that made these games appealing to us. Through this collaborative discussion, we were able to explore different perspectives, identify common interests, and evaluate which game concepts might be the most feasible and engaging for development. To narrow down our options, we conducted two rounds of voting. In the first round, each member voted for their top three preferred games, which resulted in Identity V receiving the most votes and becoming the clear front-runner. In the second round, we focused on the remaining games and discussed their potential in terms of gameplay, creativity, and alignment with our team’s skills. After careful consideration, Grapple Dog emerged as the second top choice, complementing Identity V’s style and mechanics. By the end of this process, we reached a consensus and selected these two games as the projects we were most excited to develop. This method ensured that every team member’s preferences were considered and that our final decision was both democratic and well-informed.

<p align="center">
  <img src="image/Voting1.png" height="400">
<img src="image/Voting2.png" height="400">
</p>


### Paper Prototypes

To better understand the game mechanics in depth and to evaluate how well the two games align with our game philosophy, we created two paper prototypes during the third workshop.

**First game - Survival Nightmare:**

This game is a top-down 1v1 chase-and-escape game, similar to Brawl Stars, set in a dark horror-themed environment with eerie background music. One player takes the role of the Hunter (controlled either by a second player or AI), while the other plays the Survivor. The map is filled with walls and obstacles, and placing or removing an obstacle requires a one-second delay. Throughout the match, items spawn randomly: Survivors can pick up flashlights and use them for two seconds to stun the Hunter for five seconds if exposed, while Hunters can collect souls to gain a temporary movement speed boost. The Survivor wins by collecting three randomly spawned keys to unlock the exit door and escape, but loses immediately if caught by the Hunter.


https://github.com/user-attachments/assets/5ee5a315-3f47-4811-a6de-c31d1ba30ffb

Full video: https://youtu.be/oWBqbGIQUwQ

**Second game - Skaarl:**

Swing, glide, and flow through a fast-paced 2D platformer built around momentum.
Use a lizard’s sticky tongue to grab walls, ceilings, or objects and swing across environments, also you can utilize natural membranes to glide through the air.
Chain movement smoothly, discover multiple routes, avoid your enemies and master speed through fluid, expressive traversal.
<p>
  Click the image below to jump to the video.
</p>

<p align="left">
  <a href="https://youtu.be/wsnlXCv3-HA">
    <img src="https://img.youtube.com/vi/wsnlXCv3-HA/0.jpg" width="600" alt="Demo Video">
  </a>
</p>



**Feedback:**

1. The interface of game is very clear and comprehensive.
2. It is suggested that the number of maps should be more than one. Additionally, adding different types of terrain is a good idea to increase variety.
3. The win conditions still can be further expanded.
4. The map could be extended, but the boundary still needs to be considered.
5. After a character wins, the monster can gain new skills (e.g., breaking through walls or an increasing movement speed.)
6. The tongue-flicking mechanic is an impressive idea, because it’s more special than typical 2D games which only can run and jump.

**Conclusion:**

We decided to choose second game as the game we would ultimately develop. The reason was that although first game had interesting and diverse mechanics, it would likely be more difficult to develop. Second game, in comparison, was relatively simpler and offered more room for development.

### Twist ideas from members:

1. Core Transformation and Ability System
Create a diverse action system by combining the "consuming insects or elements" mechanic with "item-based transformations."
> - Transformation Mechanism: Inspired by Kirby or Super Mario Odyssey, the protagonist can switch between different lizard forms by consuming specific insects or using special items.

> - Form Functionalities:
Draco (Flying Lizard): Extends gliding distance, allowing the player to cross large terrain gaps.
Chameleon: Blends into the environment to become invisible, useful for evading powerful enemies.
Frilled-neck Lizard: Scares off predators or utilizes its frill for specialized gliding.
> - Elemental Infusion: By using its tongue to consume fire or ice elements, the lizard can imbue its standard attacks with additional elemental damage.
> - Biological Survival and Escape Skills
Enhance combat depth by utilizing the unique physiological traits of real-world lizards.
Autotomy (Tail Shedding): An active skill that can be triggered when health is critically low. The shed tail remains on the ground to distract monsters, granting the player a brief window of invincibility and a speed boost to escape.
> - Resource Cost: This skill consumes a portion of energy, and there is a cooldown period while the tail regenerates before it can be used again.

2. Environmental Interaction and Secret Paths
Emphasize the lizard's agility and map exploration.Multi-dimensional Exploration: Level design includes not only flat ground but also vertical wall-climbing and underground digging.
Hidden Passageways: Secret paths—such as underground burrows or shortcuts inside tree trunks—that can only be discovered or accessed by specific forms (e.g., the Chameleon or a miniature lizard form).

3. Narrative Goals and Arch-Nemesis
Establish concrete motivation and a final challenge for the player.
Story Background: Define the lizard's motivation for the journey (e.g., protecting the forest or rescuing companions).
Nemesis Design: Introduce the lizard's natural predator—the Snake—as the final boss. The final battle will require the player to master all previously learned transformation and camouflage skills to defeat this powerful predator.

### Stakeholders

<p align="center">
  <img src="image/Stakeholders.png" height="400">
</p>

Drawing an Onion Diagram helps us clarify our stakeholders. We have separated them into three groups based on the degree and direction of their impact.
The First Tier is the development team, including all members of group 12. During the development process, all members' schedules in TB2 will be significantly affected; however, the project provides us with invaluable experience in game development and teamwork.
The Second Tier consists of the target customers; this means our game is developed specifically to meet their needs. These stacker holders include teacher, TA, testers and players. Of course they will get gameplay experience, and the feedback provided by them will help us improve our game.
The Third Tier is the external environment, including anyone indirectly affected by the game, such as competitors in the same domain, other developers searching for inspiration, or viewers watching gameplay streams. Although they may not experience this game in person, they will still be affected by the game's content to varying degrees.

### User Story

Peng：

- As a developer, I want to handle all collision logic through a common interface, so that the system can efficiently process interactions between diverse objects (like the player, enemies, and grapple points) without writing redundant code.

Chiu:

- As a player, I want my personal information protected and my game data securely backed up.
- As a developer, I want the data to be properly stored and structured for easy analysis.

Tsai:

- As a gamer, I want the game to have a reward system, so that when I complete a small level, I can earn a skill. This gives me the motivation to keep improving.
- As a developer, I want players to become engaged with my game and share it with others, so I need to provide rewards that keep them playing.

Huang:

- As a player,  I want to play a game  which don't need to spend too much time to understand  the game mechanism criteria: tutorial can't not more than 100 words.
- As a player,  I want to play a game  which have fluence gameplay criteria: check fps of each movement

Cheng:

- As a game designer, I aim to significantly enhance the game's depth by introducing diversified combat modes against bosses and monsters. This includes mechanics such as tongue-based strikes to hit enemies and the use of special environmental triggers to deal damage.Furthermore, I plan to implement complex level environments with dynamic effects: for instance, arctic conditions that cause gradual health drain for the lizard, and tropical rainforests where environmental factors trigger the rapid spawning of minor enemies. These elements will create a more challenging and immersive gameplay experience.

Wei:

- As a player, I want to use the lizard’s tongue to latch onto surfaces and swing across gaps, so that I can move through levels quickly and maintain momentum. Implements: The player can aim and shoot the tongue at valid surfaces.
The tongue attaches only to designated or logical surfaces.
The player can swing with physics-based motion.
Releasing at the right time preserves forward momentum.
The system feels responsive with minimal input delay.

- As a player, I want to glide while airborne, so that I can extend jumps, adjust my landing, and smoothly chain movement actions together. Implements:The player can activate glide while in the air.
Glide reduces falling speed.
The player can slightly control horizontal direction during glide.
Glide can transition smoothly from a jump or swing.
Glide ends when landing or stamina (if used) runs out.

## Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams.

### System Architecture
<div>
  <h3>1. Overview</h3>
  <p>
This project implements a 2D tile-based platformer using a modular architecture built on top of p5.js. The system follows a hybrid design combining entity-based modeling, a centralized physics system, and manager-driven resource control. The core principle is to separate behavior (Player FSM), physics (movement and collision), and world data (tile map) to ensure maintainability and extensibility.
  </p>
</div>
<div>
  <h3>2. Core Components</h3>
  <h4>2.1 Entity Hierarchy</h4>
  <p>
The base abstraction is defined in Entity.js, which provides fundamental properties such as position and size, also abstract methods update() and display(). Figure.js extends Entity by introducing velocity and collision state, making it the primary unit affected by physics.
All dynamic game objects (e.g., Player, Enemy) inherit from Figure. This ensures that movement and collision handling remain consistent across all physical entities.
  </p>
  <h4>2.2 Physics System</h4>
  <p>
The Physics.js module is responsible for updating position and resolving collisions. It operates directly on Figure instances and uses data from MapManager for collision detection.
Key characteristics:
  </p>
    <ul>
      <li>Velocity-based movement (pos += vel)</li>
      <li>Axis-separated movement and collision resolution (X and Y handled independently)</li>
      <li>Tile-based collision using map queries</li>
    </ul>
  <p>This design ensures deterministic and stable platformer physics while preventing issues such as tunneling or inconsistent collision states.</p>
  <h4>2.3 Player and State Machine</h4>
  <p>
    The Player class acts as a controller that integrates input handling, state management, and movement logic.
    It uses a finite state machine (FSM) implemented via updateState() and state-specific handlers. Each state (e.g., grounded, jumping, falling) determines how movement is applied.
    <img src="image/stateDiagram.jpg" width="1000">
  </p>
  <p>Movement is abstracted into reusable methods such as applyGroundMovement(), allowing consistent integration with physics.</p>
  <h4>2.4 Grapple Ability</h4>
  <p>The grappling feature is implemented as a module GrappleAbility, it functionally operates as a player-bound ability. It is invoked directly by the Player and modifies the player’s velocity based on anchor points and rope constraints. It does not directly control position or collision.
    This design ensures that grappling integrates seamlessly with the existing physics system without violating separation of concerns.
</div>
<div>
  <h3>3. World and Data Management</h3>
  <h4>3.1 MapManager</h4>
  <p> MapManager handles tile-based world representation using data exported from Tiled (JSON format). It provides:</p>
  <ul>
    <li>Tile lookup (getTileAt)</li>
    <li>Collision queries (isSolid)</li>
    <li>Rendering of the tile map</li>
  </ul> 
  <p>The map is stored as a 1D array, and world coordinates are converted into tile indices for efficient lookup.</p>
  <h4>3.2 Level and Resource Management</h4>
  <ul>
    <li>LevelManager handles loading and switching between levels</li>
    <li>SaveManager ensures that progress will not be lost when the page was refreshed</li>
    <li>UIManager is responsible for rendering all UI elements</li>
  </ul> 
  <p>Assets (maps, images) are organized separately under the assets directory. </p>
</div>
<div>
  <h3>4. Game Loop and Data Flow</h3>
  <p>The main loop (in sketch.js) orchestrates the update sequence:</p>
  <ul>
    <li>1.Load data and initialize the game(user interface, player, enemies, collectibles)</li>
    <li>2.Input is processed by the Player</li>
    <li>3.Player updates its state via FSM</li>
    <li>4.Movement logic modifies velocity</li>
    <li>5.Grapple ability further adjusts and constrains velocity if active</li>
    <li>6.Physics system updates position and resolves collisions</li>
    <li>7.Rendering is performed (entities, map, UI)</li>
  </ul> 
  <p>This pipeline ensures a clear separation between decision-making, physical simulation, and rendering.</p>
</div>
<div>
  <h3>5. Design Characteristics</h3>
  <p>The architecture emphasizes:</p>
  <ul>
    <li>Separation of concerns (input, behavior, physics, world)</li>
    <li>Reusability through inheritance (Entity → Figure)</li>
    <li>Stability via centralized physics handling</li>
    <li>Extensibility for future systems (e.g., new abilities, AI, weapons)</li>
  </ul> 
</div>

### Class diagram
<p>
  <img src="image/classDiagram.jpg" width="1000">
</p>

### Sequence diagram (behavioural diagram)
<p>
  <img src="image/sequence_diagram.png" width="1000">
</p>

## Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the TWO areas of *technical challenge* in developing your game. 

## Evaluation

- 15% ~750 words

- One qualitative evaluation (of your choice) 

- One quantitative evaluation (of your choice) 

- Description of how code was tested. 

## Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools and methods did you use? Did you define team roles? Reflection on how you worked together. Be honest, we want to hear about what didn't work as well as what did work, and importantly how your team adapted throughout the project.

## Conclusion

- 10% ~500 words

- Reflect on the project as a whole. Lessons learnt. Reflect on challenges. Future work, describe both immediate next steps for your current game and also what you would potentially do if you had chance to develop a sequel.

## Contribution Statement

- Provide a table of everyone's contribution, which *may* be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Please let us know as soon as possible if there are any issues with teamwork as soon as they are apparent and we will do our best to help your team work harmoniously together.

## Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5% of report grade) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.
- **Documentation** of code (5% of report grade)
  - Organise your code so that it could easily be picked up by another team in the future and developed further.
  - Is your repo clearly organised? Is code well commented throughout?





