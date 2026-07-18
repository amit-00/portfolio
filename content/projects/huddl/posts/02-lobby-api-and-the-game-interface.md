---
title: "Lobby API, Game Interface, and the Strategy Pattern"
date: 2026-07-08
excerpt: Imposter gets untangled from the Durable Object - a four-layer architecture and a Game interface that keeps games pure, sandboxed, and talking to the lobby only through effects.
---

# Defining the game interface and the lobby API

My first iteration of the imposter game was extremely coupled with the
durable object itself. Though this worked for this game, it would
probably cause some growing pains when building up and adding more games.

The software design pattern called the [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
seems to fit perfectly for this usecase. I can define an interface for
the games. The engine can then run the game through it's interface without
needing to know the interal implementation of the game. This can allow
me to plug in any implementation and still have it run in the engine.

This resulted in a layered architecture, cleary separating responsibilities
at every layer. The layers could communicate between one another with a custom
protocol.

**Layer 1 - Worker Entry**

A thin router that forwards WebSocket upgrade requests to the Durable Object.
This serves as the entry point to the lobby and handles assigning clients to
the correct socket.

**Layer 2 - The Durable Object shell**

This layer is the base of the runtime handling all operations, from connections
to lobby state, to game state. The Lobby Durable Object's reponsibilities include:

- Manage client connections
- Guard abusive connections
- Interface with storage API
- Handle the event loop (Alarms, WebSocket events, etc)

**Layer 3 - The Lobby engine**

Holds the root state for the lobby (players, hostId, selectedGame, isPlaying, 
timers, gameState). It modifies state through pure functions. The engine
layer owns everything that is lobby-level rather than game-level:

- Join/identity rules (handleJoin)
- Host management: reassigns hosts when host loses connection
- Lifecycle: mid-game disconnects, idle-lobby disconnects, DO cleanup on no connections
- Apply game effects: Translates game effects into lobby effects

**Layer 4 - The Game**

The Game interface defines the contract. Games are fully pure and sandboxed by construction.
Game implementations never see sockets, storage, or lobby state. A game only interacts with it's
own state and communicates that and any other messages to the lobby through the defined protocol.

```typescript
interface Game {
    name: string;
    minPlayers: number;
    init(): GameTransition;
    onMessage(): GameTransition;
    onTimer(): GameTransition;
    onPlayerJoined(): GameTransition;
    onPlayerDisconnected(): GameTransition;
    onPlayerReconnected(): GameTransition;
    snapshotFor();
}

interface GameTransition {
    state: unknown;
    effects: GameEffect[];
}
```

This interface also serves as an API for the game to handle bevahior in
reponse to events in the lobby, such as providing behaviour on what
to do if a player disconnects, or sends a message, etc.

You can see that most of the methods defined on the game interface
return the GameTransition object. This object is how the game communicates
it's state as well as any effects back to the engine. The engine is the
layer that sits between the durable object and the game and enables
communication between them.

The actions a game can take on the durable object (or lobby, can be interangeable here)
are defined through a protocol which is represented as the `GameEffect` type.

```typescript
type GameEffect =
  | { kind: "broadcast"; event: unknown }
  | { kind: "send"; to: PlayerId; event: unknown }
  | { kind: "setTimer"; id: string; at: number }
  | { kind: "clearTimer"; id: string }
  | { kind: "end"; summary: unknown };
```

This design can be visualized like this:

![Layered architecture design](/huddl/engine_layers.png)