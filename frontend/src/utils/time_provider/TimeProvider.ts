
export enum TimeKind {
    circular,
    walk,
    once,
} 
export enum TimeDirection {
    forward,
    backward,
} 
export enum TimeState {
    paused,
    stopped,
    playing,
    ready,
} 

export enum TimeSpeed {
    slow,
    medium,
    fast
}

export type TimeFrame = {
    previous : string
    current : string
    next : string
}

export type TimeConfig = {
    kind? : TimeKind,
    direction? : TimeDirection,
    speed? : TimeSpeed | number
}

export default class TimeProvider {

    experiments! : string[]
    size! : number
    time! : number
    direction! : TimeDirection
    kind! : TimeKind
    state!: TimeState
    current! : TimeFrame
    interval! : number
    interval_id? : number

    private constructor(experiments : string[],time : number,config:TimeConfig) {
        this.experiments = experiments
        this.time = time
        this.size = experiments.length
        this.kind = config.kind ?? TimeKind.circular
        this.direction = config.direction ?? TimeDirection.forward
        this.state = TimeState.ready
        this.current = {
            current : this.experiments[time],
            previous : this.experiments[(this.size + time - 1) % this.size],
            next : this.experiments[(this.size + time + 1) % this.size],
        }
        let config_speed = config.speed ?? TimeSpeed.medium
        let speed = config_speed
        if (config_speed === TimeSpeed.slow) {
            speed = 1000
        }
        if (config_speed === TimeSpeed.medium) {
            speed = 500
        }
        if (config_speed === TimeSpeed.fast) {
            speed = 250
        }
        this.interval = speed
        
    }
    start(callback : (frame:TimeFrame) => void) {
        if(this.state === TimeState.ready || this.state === TimeState.paused) {
            this.interval_id = window.setInterval(() => {
                callback(this.current)
                this.next()
            },this.interval)
            this.state = TimeState.playing
        }
    }

    pause() {
        if (this.interval_id) {
            window.clearInterval(this.interval_id)
            this.state = TimeState.paused
        }
    }

    stop() {
        if (this.interval_id) {
            window.clearInterval(this.interval_id)
            this.state = TimeState.stopped
        }
    }

    prepare() {
        switch (this.kind) {
            case TimeKind.once:
                if (this.direction === TimeDirection.backward) {
                    this.time = this.size - 1
                }else {
                    this.time = 0
                }
                break;
            default:
                break;
        }
        this.state = TimeState.ready
    }

    previous() {
        const current_time = this.time
        let next_time = this.direction === TimeDirection.forward ? this.time - 1 : this.time + 1
        let next_next_time =  this.direction === TimeDirection.forward ? this.time - 2 : this.time + 2
        switch (this.kind) {
            case TimeKind.circular:

                this.time = (this.size + next_time) % this.size
                this.current = {
                    current : this.experiments[this.time],
                    previous : this.experiments[current_time],
                    next : this.experiments[(this.size + next_next_time) % this.size],
                }
                break;
            case TimeKind.walk:
                if (this.time === 0) {
                    this.time = 1
                    next_next_time = 2
                }else if (this.time === this.size - 1) {
                    this.time = this.size - 2
                    next_next_time = this.size - 3
                }else {
                    this.time = next_time
                    this.direction = this.direction === TimeDirection.forward ? TimeDirection.backward : TimeDirection.forward 
                    if (next_next_time === this.size) {
                        next_next_time = this.size - 1
                    }
                }
                this.current = {
                    current : this.experiments[this.time],
                    previous : this.experiments[current_time],
                    next : this.experiments[next_next_time],
                }
                break;
            case TimeKind.once:
                if (next_time < 0 || next_time >= this.size) {
                    this.state = TimeState.stopped
                }else {
                    this.time = next_time
                    if (next_next_time < 0 ) {
                        next_next_time = 0
                    } 
                    if ( next_next_time >= this.size) {
                        next_next_time = this.size - 1
                    }
                }
                this.current = {
                    current : this.experiments[this.time],
                    previous : this.experiments[current_time],
                    next : this.experiments[next_next_time],
                }
                break;
            default:
                break;
        }
    }

    next() {
        const current_time = this.time
        let next_time = this.direction === TimeDirection.forward ? this.time + 1 : this.time - 1
        let next_next_time =  this.direction === TimeDirection.forward ? this.time - 2 : this.time + 2
        switch (this.kind) {
            case TimeKind.circular:

                this.time = (this.size + next_time) % this.size
                this.current = {
                    current : this.experiments[this.time],
                    previous : this.experiments[current_time],
                    next : this.experiments[(this.size + next_next_time) % this.size],
                }
                break;
            case TimeKind.walk:
                if (this.time === 0) {
                    this.time = 1
                    next_next_time = 2
                    this.direction = this.direction === TimeDirection.forward ? TimeDirection.backward : TimeDirection.forward 
                }else if (this.time === this.size - 1) {
                    this.time = this.size - 2
                    next_next_time = this.size - 3
                    this.direction = this.direction === TimeDirection.forward ? TimeDirection.backward : TimeDirection.forward 
                }else {
                    this.time = next_time
                    if (next_next_time === this.size) {
                        next_next_time = this.size - 1
                    }
                }
                this.current = {
                    current : this.experiments[this.time],
                    previous : this.experiments[current_time],
                    next : this.experiments[next_next_time],
                }
                break;
            case TimeKind.once:
                if (next_time < 0 || next_time >= this.size) {
                    this.state = TimeState.stopped
                }else {
                    this.time = next_time
                    if (next_next_time < 0 ) {
                        next_next_time = 0
                    } 
                    if ( next_next_time >= this.size) {
                        next_next_time = this.size - 1
                    }
                }
                this.current = {
                    current : this.experiments[this.time],
                    previous : this.experiments[current_time],
                    next : this.experiments[next_next_time],
                }
                break;
            default:
                break;
        }
    }
    static from(experiments : string[],cursor:number,config?:TimeConfig) {
        if (Math.abs(cursor) < 1) {
            return new TimeProvider(experiments,Math.round((experiments.length -1) * Math.abs(cursor)),config ?? {})
        }else {
            return new TimeProvider(experiments,(Math.round(Math.abs(cursor)) % experiments.length),config ?? {})
        }
    }
    static fromStart(experiments : string[],config?:TimeConfig) {
        return new TimeProvider(experiments,0,config ?? {})
    }

    static fromEnd(experiments : string[],config?:TimeConfig) {
        return new TimeProvider(experiments,experiments.length - 1,config ?? {})
    }
}