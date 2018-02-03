import {Util,Step} from "./util";
interface ICore{
	duration?:number;
	render(...args:number[]):void;
	value:Step[];
	timFn?:string;
	onEnd?:()=>void;
}

// interface Tween{
// 	fn(currentTime:number,beginVal:number,changeVal:number,duration:number):number;
// }

export default class Core{
	private duration?:number;
	private startTime:number=0;
	private render:(...args:number[])=>void;
	private values:Step[];
	private timFn:string;
	private onEnd:()=>void;
	public state:string='init';
	constructor({
		duration=1000,
		render,
		value,
		timFn='linear',
		onEnd
	}:ICore){
		this.duration=duration;
		this.values=value;	
		this.timFn=timFn;
		this.render=render;
		this.onEnd = onEnd;

	}
	private _loop(){
			const t:number=Date.now()-this.startTime;
			const d:number = this.duration as number;
			const timeFn = Util.Tween[this.timFn];
			
			if(t>=d	|| this.state==='end'){
				this.end();
			}else{
				this._renderFn(t,d,timeFn);
				Util.reqAnimF(this._loop.bind(this));
			}

	}

	private end(){
		this._renderEndState();
		this.onEnd && this.onEnd();
	}

	private _renderEndState(){
		const t:number=Date.now()-this.startTime;
		const d:number = this.duration as number;
		const timeFn = Util.Tween[this.timFn];
		this._renderFn(d,d,timeFn);
		this.state = 'end';
	}

	private _renderFn(
		time:number,
		duration:number,
		timingFn:(
			currentTime:number,
			beginVal:number,
			changeVal:number,
			duration:number)=>number
		){

			const values = this.values;
			const doneVal:number[]=values.map(value=>{
				return timingFn(time,value.start,value.end-value.start,duration);
			})

			this.render(...doneVal);
		
	}
	private _play():void{
		this.startTime=Date.now();
		this.state='play';
		Util.reqAnimF(this._loop.bind(this));
	}
	play(){
		this._play();
	}
}