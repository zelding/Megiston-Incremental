import {Game} from './game';

export default class Runner {
    public static timeStep: number = 100.0;
    public static fps: number = 0.0;

    protected static game: Game;
    protected static currentLoopId: number|null = null;

    private static delta: number = 0.0;
    private static previousTime: number = 0.0;

    private static stopping: boolean = false;

    static {

    }

    public static setGame(game: Game) {
        Runner.game = game;
    }

    public static stop(): void {
        Runner.stopping = true;

        if ( null !== Runner.currentLoopId ) {
            window.cancelAnimationFrame(Runner.currentLoopId);
            Runner.currentLoopId = null;
            console.debug("stopped");
        }
    }

    public static start(time: number = 0.0) : void {
        console.debug("started");

        if ( Runner.stopping && null !== Runner.currentLoopId ) {
            Runner.stopping = false;
            return;
        }

        Runner.currentLoopId = window.requestAnimationFrame(Runner.loop);
    }

    public static isRunning(): boolean {
        return Runner.currentLoopId !== null;
    }

    public static getDelta(): number {
        return Runner.delta;
    }

    public static loop(time: number): void {
        // Compute the delta-time against the previous time
        const dt = time - Runner.previousTime;

        // calc fps
        Runner.fps = Math.round(1000.0 / dt);

        // Accumulate delta time
        Runner.delta = Runner.delta + dt;

        // Update the previous time
        Runner.previousTime = time;

        // Update your game
        while (!Runner.stopping && Runner.delta > Runner.timeStep) {
            Runner.game.tick(Runner.timeStep);
            Runner.delta -= Runner.timeStep;
        }

        // Render your game
        Runner.game.updateLayout();

        if ( !Runner.stopping ) {
            // Repeat
            Runner.currentLoopId = window.requestAnimationFrame(Runner.loop);

            return;
        }

        Runner.stopping = false;
    }
}
