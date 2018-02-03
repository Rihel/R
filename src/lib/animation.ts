import { Step, Util } from "./util";
import Core from "./core";

export default class Animation{
	public json:CSSStyleDeclaration;
	public callback?:()=>void;
	// public values:Step[]=[]
	public el:HTMLElement;
	public s:Core[]=[];
	public duration?:number;
	constructor(el:HTMLElement,json:{[index:string]},duration?:number,callback?:()=>void){
		// const values:Step[]=[];
		this.el=el;
		this.json=json;
		if(typeof duration === 'function'){
			this.callback =duration as ()=>void;
			this.duration = 300;
		}else{
			this.callback =callback;
			this.duration = duration;
		}
		this._init();
		this.start();
	}
	private _init(){
		const json = this.json;
		const keys = Object.keys(json);
		const _me = this;
		for(const key in json){
			const isOpacity:boolean=key==='opacity';
			const values:Step[]=[];
			let start = isOpacity ?parseFloat(this._getStyle(key)):parseInt(this._getStyle(key));
			let end = json[key];
			values.push(Util.createStep(start,end));
			this.s.push(new Core({
				duration:this.duration,
				value:values,
				render(...arg):void{
					if(isOpacity){
						_me.el.style[key]=arg[0];
					}else{
						_me.el.style[key]=arg[0]+'px';
					}
				},
				onEnd(){
					_me.callback&&_me.callback();
				}
			}))
		}

	}
	public start(){
		this.s.forEach(c=>{
			c.play();
		})
	}
	private _getStyle(attr:string):string{
		return getComputedStyle(this.el)[attr as string];
	}
}