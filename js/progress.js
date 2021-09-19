$(function(window){
	function Progress($play_progress_dashline,$play_progress_solidline,$play_progress_spot){
		return new Progress.prototype.init($play_progress_dashline,$play_progress_solidline,$play_progress_spot);
	}
	Progress.prototype = {
		constructor:Progress,
		isMove : false,
		init : function($play_progress_dashline,$play_progress_solidline,$play_progress_spot){
			this.$play_progress_dashline = $play_progress_dashline;
			this.$play_progress_solidline = $play_progress_solidline;
			this.$play_progress_spot = $play_progress_spot;
		},
		progressClick : function(callback){
			var $this = this;
			// 监听背景的点击
			this.$play_progress_dashline.click(function(event){
				// 获取背景距离窗口的距离
				var normalleft = $(this).offset().left
				// 获取点击处距离窗口的距离
				var distance =event.pageX;
				// 设置前景的宽度
				$this.$play_progress_solidline.css("width",distance - normalleft);
				// 设置圆点的距离
				$this.$play_progress_spot.css("left",distance - normalleft);
				// 计算进度条的比例
				var value = (distance - normalleft) / $(this).width();
				callback(value);
			})
		},
		progressMove : function(callback){
			var $this = this;
			// 获取背景距离窗口的距离
			var normalleft = $this.$play_progress_dashline.offset().left;
			// 获取点击处距离窗口的距离
			var distance;
			// 监听鼠标的点击
			var dashWidth = this.$play_progress_dashline.width();
			this.$play_progress_dashline.mousedown(function(){
				$this.isMove = true;
				// 监听鼠标的移动
				$(document).mousemove(function(event){
					// 获取点击处距离窗口的距离
				    distance =event.pageX;
					var offset = distance - normalleft;
					if(offset >= 0 && offset <= dashWidth){
						// 设置前景的宽度
						$this.$play_progress_solidline.css("width",distance - normalleft);
						// 设置圆点的距离
						$this.$play_progress_spot.css("left",distance - normalleft);
					}
				})
			})
			$(document).mouseup(function(){
				$(document).off("mousemove");
				$this.isMove = false;
				// 计算进度条的比例
				var value = (distance - normalleft) / $this.$play_progress_dashline.width();
				callback(value);
			})
		},
		setProgress : function (value){
			if(this.isMove) return;
			if(value < 0 || value > 100) return;
		    this.$play_progress_solidline.css({
				width : value + "%"
			});	
			this.$play_progress_spot.css({
				left : value + "%"
			})
		}
	}
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
}(window))