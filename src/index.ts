import './app.sass'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Game, SaveGame} from './core/game';
import Runner from './core/runner';

const saveData = window.localStorage[ SaveGame.STORAGE_KEY ] ?? "{}";

// Launch
const save = new SaveGame(saveData);
const game = new Game(save);
Runner.setGame(game);

document.addEventListener('readystatechange', (e) => {
    console.debug(e);
    if ( document.readyState !== 'complete') return;

    game.initPops();

    document.querySelector('#game_toggle_button').addEventListener('click', (e) => {
        let btn = this ?? document.querySelector('#game_toggle_button');
        if (Runner.isRunning() ) {
            Runner.stop();

            // @ts-ignore
            btn.innerHTML = "Start game";
            return;
        }

        // @ts-ignore
        btn.innerHTML = "Stop game";
        Runner.start();
    });
});



