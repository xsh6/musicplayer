$(function(window){ //入口函数可以传一个形参，入口函数严格执行
	function Player($audio){
		return new Player.prototype.init($audio);
	}
	Player.prototype = {
		constructor:Player,
		musicList : [],
		init : function($audio){
			this.$audio = $audio;
			this.audio = $audio.get(0);
		},
		current : -1,
		playMusic : function(index,music){
			// 判断是否是同一首音乐
			if(this.current == index){
				// 同一首音乐
				if(this.audio.paused){
					this.audio.play();
				} else{
					this.audio.pause();
				}
			} else{
				// 不是同一首音乐
				this.$audio.attr("src",music.link_url);
				this.audio.play();
				this.current = index;
			}
		},
		play_previous : function(){
			var index = this.current - 1;
			if(index <= -1){
				index = $(".music_passage").length - 1;
			}
			return index;
		},
		play_next : function(){
			var index = this.current + 1;
			if(index > $(".music_passage").length - 1){
				index = 0;
			}
			return index;
		},
		changeMusic : function(index){
			// 删除对应的数据
			this.musicList.splice(index,1);
			// splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。第一个参数：删除开始元素的索引，
			// 第二个参数：删除的个数，第三个元素：替换的值
			
			// 判断删除的元素是否在正在播放元素的前面
			if(index < this.current){
				this.current = this.current - 1;
			}
		},
		musicTimeUpData : function(callBack){
			var $this = this;
			// 监听播放的进度
			this.$audio.on("timeupdate",function(){
				var duration =  $this.audio.duration;
				var currentTime = $this.audio.currentTime;
				var timeStr = $this.formatData(duration,currentTime);
				callBack(duration,currentTime,timeStr);
			})
		},
		formatData : function(duration,currentTime){
			var endMin = parseInt(duration / 60);
			var endSec = parseInt(duration % 60);
			if(endMin < 10) {
				endMin = "0" + endMin;
			}
			if(endSec < 10){
				endSec = "0" + endSec;
			}
			var startMin = parseInt(currentTime / 60);
			var startSec = parseInt(currentTime % 60);
			if(startMin < 10) {
				startMin = "0" + startMin;
			}
			if(startSec < 10){
				startSec = "0" + startSec;
			}
			return startMin+":"+startSec+" / "+endMin+":"+endSec;
		},
		musicSeekTo : function(value){
			if(isNaN(value)) return;
			this.audio.currentTime = this.audio.duration * value;
		},
		musicVoiceSeekTo : function(value){
			// volume的取值为 0~1,为0时没有声音,1时最大声音
			if(isNaN(value)) return;
			if(value < 0 || value > 1) return;
			this.audio.volume = value; 
			// this和$this的区别
			// 表示对象不同：this表示的是javascript提供的当前对象，$(this)表示的是用jquery封装候的当前对象。
			// 过程不同：this对象可以直接用this.style修改样式，$(this)可以使用jquery提供的方法访问样式。
		}
	}
	Player.prototype.init.prototype = Player.prototype;
	window.Player = Player;  //这是将player变为全局变量
}(window));