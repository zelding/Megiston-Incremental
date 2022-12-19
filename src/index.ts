import './app.sass'
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

    const btn = document.querySelector('#game_toggle_button');

    if ( btn ) {
        btn.addEventListener('click', (e: Event) => {
            console.debug(e, this);
            if (Runner.isRunning()) {
                Runner.stop();

                btn.innerHTML = "Start game";
                return;
            }

            btn.innerHTML = "Stop game";
            Runner.start();
        });
    }
});



