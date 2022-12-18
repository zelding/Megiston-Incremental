import {Popover, Dropdown} from "bootstrap";
import Decimal from 'break_eternity.js';
import Runner from "./runner";

class Shape {
    public value  : Decimal;
    public bought : Decimal;
    public income : Decimal;

    public auto: boolean = false;

    constructor(value: string, bought: string, income: string) {
        this.value  = new Decimal(value);
        this.bought = new Decimal(bought);
        this.income = new Decimal(income);
    }
}

class Ascension {
    public value: Decimal;
}

class ShapesCollection {
    public triangles : Shape
    public shards : Shape
    public prisms : Shape
    public stars : Shape
}

class Ascensions {
    public flip: Ascension;
    public combine: Ascension;
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

class GameData {
    public readonly version : number;

    protected resources : object = {
        resources : new Decimal(0),
        flipped   : new Decimal(0),
        squares   : new Decimal(0),
    };

    protected upgrades : boolean[];

    protected achievements: boolean|null[] = [];
    protected logs : string[] = [];

    protected shapes: ShapesCollection;

    protected ascensions: Ascensions;

    public constructor(version: number = 21) {
        this.shapes  = new ShapesCollection();
        this.version = version;
    }

    /**
     * @override
     */
    public toJSON(): object {
        return {
            version: this.version,
            achievements: this.achievements,
            log: this.logs,
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
                flipped: this.ascensions.flip.value,
                value: 0,
                upgrades: [],
                flipMulti: 0
            },
            squares: {
                combined: this.ascensions.combine,
                upgrades: [],
                value: this.ascensions.combine.value
            }
        };
    }
}

export class Game {
    public readonly startedAt: number

    protected gameData: GameData;

    protected totalTime: number;

    constructor(saveData: SaveGame | null) {
        this.gameData  = saveData;
        this.startedAt = performance.now();
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
        document.querySelector('#fps_dsp').innerHTML = Runner.fps.toString() + " fps " + Math.round(Runner.getDelta()) + " ms";
    }
}

export class SaveGame extends GameData {
    static STORAGE_KEY: string = "MegistonSave";

    constructor(saveData: string) {
        const parsed = JSON.parse(saveData);

        if ( typeof parsed !== "object" ) {
            throw new Error("Malformed JSON");
        }

        super(parsed.version);

        this.load(parsed);
    }

    protected load(saveData: any|object) {
        this.logs         = saveData.logs         ?? [];
        this.achievements = saveData.achievements ?? [];

        if ( saveData.triangles ) {
            this.shapes.triangles = new Shape(
                saveData.triangles.value,
                saveData.triangles.bought,
                saveData.triangles.income
            );
            this.shapes.triangles.auto = !!saveData.triangles.auto;
        }

    }

    public save() :void {
        window.localStorage[ SaveGame.STORAGE_KEY ] = JSON.stringify(this);
    }

    public delete() {
        delete window.localStorage[ SaveGame.STORAGE_KEY ];
    }
}
