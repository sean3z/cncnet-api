# Leaderboard Feature List

### Release version - 1.0
- [x] Leaderboard support for Tiberian Sun and Red Alert 1.
- [x] Player listings
  - [x] Show top 50 player rankings for each game
  - [x] To display players: Rank, Points, Wins, Losses.
- [x] Player detail
  - [x] Show a player profile by clicking from player listings.
  - [x] Show a players rank, points, wins, losses.
  - [x] Show a players win/loss ratio.
  - [x] Show list of players games
    - [x] The id of the game, and experience gained.
- [x] Player search
  - [x] Input on player listings for user to search for player. Will return outside of top50 too.
  - [x] Result should show player name(s), and should be clickable to player profile.
- [ ] HTMl5 Mode - server should re-write hashtags.
- [ ] Landing page for leaderboard
  - [ ] Show available games on the leadeboard 
  - [ ] Clickable games should direct to the relevant leaderboard
  
### In planning

- Player listings
  - Show top 50 player rankings for each game, allow sorting by rank, points, wins, losses.
  - Should have option to reveal quickfire stats
- Player detail
  - Show a players profile rank badge
  - Show a players rank name, e.g 'Colonel' under Rank#
  - Show a players estimated calculation of wins/losses required for promotion/demotion.
  - Show list of players game
    - The id of the game, outcome of game, experience gained
- Game Resolution Parser
  - Automatically detect match stats leader on disconnect or out of sync games
- Clans
  - Players can create and join clans to compete on a clan ladder
