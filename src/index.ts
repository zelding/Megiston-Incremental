import './app.sass'
import 'bootstrap/dist/css/bootstrap.min.css'

import {Game, SaveGame} from './core/game';

const saveData = window.localStorage[ SaveGame.STORAGE_KEY ];

const save = new SaveGame(saveData);
const game = new Game(save);

export default () => {
    game.initPops();

    return game;
};

