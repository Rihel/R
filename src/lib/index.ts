import Animation from "./animation";

export default class R{
	public static animate(el:HTMLElement,json:object,duration?:number,callback?:()=>void){
		return new Animation(el,json,duration,callback);
	}
}