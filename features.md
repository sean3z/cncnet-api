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
- [ ] HTML5 Mode - server should re-write hashtags.
- [x] Landing page for leaderboard
  - [x] Show available games on the leadeboard 
  - [x] Clickable games should direct to the relevant leaderboard
  
### Release version - 1.1
- [ ] Save Player Records after end of ladder cycle
  - [ ] Award player for top 3 finish: Gold, Silver, Bronze.  
  - [ ] Store Player's previous Rank in player obj that can be displayed into UI.
- [ ] HTML 5 Mode - rewrite hashtags


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
- Clans
  - Players can create and join clans to compete on a clan ladder
