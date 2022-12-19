import {Popover, Dropdown} from "bootstrap";
import Decimal from 'break_eternity.js';
import Runner from "./runner";
import './../settings';
import {CURRENT_SAVE_VERSION, TRIANGLE_INCOME_START} from "../settings";

class Shape {
    public value  : Decimal;
    public bought : Decimal;
    public income : Decimal;

    public auto: boolean = false;

    public constructor(value: string, bought: string, income: string) {
        this.value  = new Decimal(value);
        this.bought = new Decimal(bought);
        this.income = new Decimal(income);
    }
}

class Ascension {
    public value: Decimal;

    public constructor() {
        this.value = new Decimal(0);
    }
}

class ShapesCollection {
    public readonly triangles : Shape
    public readonly shards : Shape
    public readonly prisms : Shape
    public readonly stars : Shape

    public constructor(t: Shape|null = null, s: Shape|null = null, pr: Shape|null = null, st: Shape|null = null) {
        this.triangles =  t ?? new Shape("0", "0", TRIANGLE_INCOME_START.toString());
        this.shards    =  s ?? new Shape("0", "0", "0");
        this.prisms    = pr ?? new Shape("0", "0", "0");
        this.stars     = st ?? new Shape("0", "0", "0");
    }
}

class Ascensions {
    public flip: Ascension|null = null;
    public combine: Ascension|null = null;
}

enum Achievements {
    "Meaningful start",
    "A tiny wall",
    "▲(10)",
    "Life sHard",
    "Is that enough?",
    "Disappointed",
    "Through the roof",
    "Don't need those",
    "▲2(10)",
    "Ni.ce",
    "Rebuyable",
    "Finally",
    "Like a Pro",
    "Inefficient",
    "▢=10",
    "Triforce",
    "Bulk profit",
    "That's a triangle too"
}

abstract class GameData {
    public readonly version : number;

    protected resources : object = {
        resources : new Decimal(0),
        flipped   : new Decimal(0),
        squares   : new Decimal(0),
    };

    protected upgrades : boolean[] = [];

    protected achievements: boolean|null[] = [];
    protected logs : string[] = [];

    protected shapes: ShapesCollection|undefined;

    protected ascensions: Ascensions;
    protected  totalTime: number = 0;

    protected constructor(version: number = 21, data: any|null) {
        this.version    = version;
        this.ascensions = new Ascensions();

        if ( data ) {
            this.loadJSON(data);
        }
    }

    protected abstract loadJSON(saveData: any|object): void;

    /**
     * @override
     */
    public toJSON(): object {
        let returnData = {
            version: this.version,
            achievements: this.achievements,
            log: this.logs
        };

        if ( this.shapes ) {
            let extra = {
                triangles: {
                    value: this.shapes.triangles.value,
                    bought: this.shapes.triangles.bought,
                    income: this.shapes.triangles.income
                },
                shards: {
                    auto: this.shapes.shards.auto,
                    bought: this.shapes.shards.bought,
                    value: this.shapes.shards.value
                },
                flip: {
                    flipMultAuto: false,
                    flipped: this.ascensions && this.ascensions.flip ? this.ascensions.flip.value : null,
                    value: 0,
                    upgrades: [],
                    flipMulti: 0
                },
                squares: {
                    combined: this.ascensions.combine,
                    upgrades: [],
                    value: this.ascensions && this.ascensions.combine ? this.ascensions.combine.value : null
                }
            };

            returnData = {...returnData, ...extra};
        }

        return returnData;
    }
}

class NewGameData extends GameData
{
    public constructor(version: number = 21) {
        super(version, null);

        this.totalTime  = 0;
        this.ascensions = new Ascensions();
    }

    protected loadJSON(saveData: any): void {
        this.shapes = new ShapesCollection();
    }
}

export class Game {
    public readonly startedAt: number

    protected gameData: GameData;

    protected totalTime: number = 0;

    public constructor(saveData: SaveGame|null) {
        this.startedAt = performance.now();

        if ( saveData ) {
            this.gameData = saveData;
        }
        else {
            this.gameData = new NewGameData(CURRENT_SAVE_VERSION);
        }
    }

    public initPops(): void {
        console.log("here");
        document.querySelectorAll('[data-toggle="popover"]').forEach( el => new Popover(el) );
        document.querySelectorAll('[data-toggle="dropdown"]').forEach( el => new Dropdown(el) );
    }

    public tick(timeStep: number): void {
        console.debug(timeStep);

        //this.gameData.resourcues

        this.totalTime += timeStep;
    }

    public updateLayout(): void {
        const el = document.querySelector('#fps_dsp');

        if (el) {
            el.innerHTML = Runner.fps.toString() + " fps " + Math.round(Runner.getDelta()) + " ms";
        }
    }
}

export class SaveGame extends GameData {
    static STORAGE_KEY: string = "MegistonSave";

    constructor(saveData: string) {
        const parsed = JSON.parse(saveData);

        if ( typeof parsed !== "object" ) {
            throw new Error("Malformed JSON");
        }

        super(parsed.version, parsed);
    }

    protected loadJSON(saveData: any|object): void {
        this.logs         = saveData.logs         ?? [];
        this.achievements = saveData.achievements ?? [];

        let t, s, pr, st : Shape|null = null;

        if ( saveData.triangles ) {
            t = new Shape(
                saveData.triangles.value,
                saveData.triangles.bought,
                saveData.triangles.income
            );

            t.auto = saveData.triangles.auto;
        }

        if ( saveData.shards ) {
            s = new Shape(
                saveData.shards.value,
                saveData.shards.bought,
                saveData.shards.income
            );

            s.auto = saveData.shards.auto;
        }

        if ( saveData.prisms ) {
            pr = new Shape(
                saveData.prisms.value,
                saveData.prisms.bought,
                saveData.prisms.income
            );

            pr.auto = saveData.prisms.auto;
        }

        if ( saveData.stars ) {
            st = new Shape(
                saveData.stars.value,
                saveData.stars.bought,
                saveData.stars.income
            );

            st.auto = saveData.stars.auto;
        }

        this.shapes = new ShapesCollection(t, s, pr, st);
    }

    public save() :void {
        window.localStorage[ SaveGame.STORAGE_KEY ] = JSON.stringify(this);
    }

    public delete() {
        delete window.localStorage[ SaveGame.STORAGE_KEY ];
    }
}
