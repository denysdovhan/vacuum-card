# Contributing

If you plan to contribute back to this repo, please fork & open a PR.

## How to run locally

1. Clone this repo to wherever you want:
   ```sh
   git clone https://github.com/denysdovhan/vacuum-card.git
   ```
2. Go into the repo folder:
   ```sh
   cd vacuum-card
   ```
3. Install dependencies (Node.js and npm are required):
   ```sh
   npm install
   ```
4. Run development server. It's going to watch source files, recompile on changes and server compiled file on local server.
   ```sh
   npm start
   ```
5. Add `http://localhost:5000/vacuum-card.js` to your Lovelace resources.

Now you can make changes to files in `src` folder. Development server will automatically rebuild on changes. Lovelace will load resource from development server. Refresh the browser to see changes. Make sure cache is cleared or disabled.
