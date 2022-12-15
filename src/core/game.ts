import {Popover, Dropdown} from "bootstrap";
import Decimal from 'break_eternity.js';

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

}

class ShapesCollection {
    public triangles : Shape
    public shards : Shape
    public prisms : Shape
    public stars : Shape
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
    /*game.resource = new Decimal(0);
    game.triangles = {};
    game.triangles.value = new Decimal(0);
    game.triangles.bought = new Decimal(0);
    game.triangles.income = new Decimal(1);
    game.achievements = [];
    game.log = [];

    game.version = 21;*/

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

    protected ascensions: object = {
        flip    : new Ascension(),
        combine : new Ascension()
    };

    constructor(version: number = 21) {
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
                flipped: this.ascensions.flip,
                value: 0,
                upgrades: [],
                flipMulti: 0
            }
        };
    }
}

// {"resource":"16","triangles":{"value":"1","bought":"0","income":"2"},"flip":{"flipped":"1","value":"1","upgrades":[],"flipMulti":"0"},"achievements":[true],"log":["Flipping resets all resource and ▲. Upgrades and achievements will not reset","Get 1e3 resource to flip","Achievement unlocked: Meaningful start"],"version":21}
export class Game {
    protected gameData: GameData;

    constructor(saveData: SaveGame | null) {
        this.gameData = saveData;
    }

    public initPops(): void {
        console.log("here");
        document.querySelectorAll('[data-toggle="popover"]').forEach( el => new Popover(el) );
        document.querySelectorAll('[data-toggle="dropdown"]').forEach( el => new Dropdown(el) );
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
        this.logs = saveData.logs;
        this.achievements = saveData.achievements;

        this.shapes.triangles = new Shape(
            saveData.triangles.value,
            saveData.triangles.bought,
            saveData.triangles.income
        );
        this.shapes.triangles.auto = !!saveData.triangles.auto;

    }

    public save() :void {
        window.localStorage[ SaveGame.STORAGE_KEY ] = JSON.stringify(this);
    }

    public delete() {
        delete window.localStorage[ SaveGame.STORAGE_KEY ];
    }
}
