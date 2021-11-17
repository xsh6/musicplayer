$(function(){
	
	//自定义滚动条
	$(".container_left_down").mCustomScrollbar();
	var $audio = $("audio");
	var playerxsh = new Player($audio);//当前正在播放的元素
	var $play_progress_dashline = $(".play_progress_dashline");
	var $play_progress_solidline = $(".play_progress_solidline");
	var $play_progress_spot = $(".play_progress_spot");
	var progress = new Progress($play_progress_dashline,$play_progress_solidline,$play_progress_spot);
	progress.progressClick(function(value){
		playerxsh.musicSeekTo(value);
	});
	progress.progressMove(function(value){
		playerxsh.musicSeekTo(value);
	});
	var $play_voice_dashline = $(".play_voice_dashline");
	var $play_voice_solidline = $(".play_voice_solidline");
	var $play_voice_spot = $(".play_voice_spot");
	var progressVoice = new Progress($play_voice_dashline,$play_voice_solidline,$play_voice_spot);
	progressVoice.progressClick(function(value){
		playerxsh.musicVoiceSeekTo(value);
	});
	progressVoice.progressMove(function(value){
		playerxsh.musicVoiceSeekTo(value);
	});
	//1. 加载歌曲列表
	getPlayList();
	function getPlayList(){
		$.ajax({
			url:"./source/music.json",//ajax加载文件的位置,js文件在HTML中调用所以使用./
			type: "GET",//请求方式为get
			dataType:"json",  //加载文件的类型
			success:function(data){  //加载成功后返回数据
				// 遍历获取到的数据，创建每一条音乐
				playerxsh.musicList = data;
				// console.log(data);
				$.each(data,function(index,ele){
					var $item = createMusicItem(index,ele);
					var $musicList = $(".paly_list ul");
					$musicList.append($item);
				})
				// 初始化歌曲信息
				InitMusicInfo(data[0]);
			},
			error:function(e){   //加载失败后返回失败的原因
				console.log(e); 
			}
		});
	}
	// 初始化歌曲信息
	function InitMusicInfo(music){
		// 获取相关的元素
		var $musicImage = $(".play_back img");
		var $music_name = $(".song_name a");
		var $musicPlayer = $(".song_player a");
		var $musicAlbum = $(".song_album a");
		var $musicInfoName = $(".play_information_name");
		var $musicInfoTime = $(".play_information_time");
		var $musicBg = $(".mask_bg");
		// 给元素赋值
		$musicImage.attr("src",music.music_url);
		$music_name.text(music.name);
		$musicPlayer.text(music.singer);
		$musicAlbum.text(music.album);
		$musicInfoName.text(music.name+" / "+music.singer);
		$musicInfoTime.text("00:00/ "+ music.time);
		$musicBg.css("background","url('"+music.music_url+"')");
	}
	// 2.初始化事件监听
	initEvents();
	function initEvents(){
		// 监听list_passage的移入和移出
		$(".paly_list").delegate(".music_passage","mouseenter",function(){
			// 移入时，监听list_menu的出现;finf()该方法可以找到正在处理元素的子元素
			$(this).find(".list_menu").stop().fadeIn(100);
			// 监听删除的出现
			$(this).find(".music_time>a").stop().fadeIn(100);
			// 时长的消失
			$(this).find(".music_time>span").stop().fadeOut(100);
		});
		$(".paly_list").delegate(".music_passage","mouseleave",function(){
			// 移出时，监听list_menu的消失
			$(this).find(".list_menu").stop().fadeOut(100);
			//监听删除的消失
			$(this).find(".music_time>a").stop().fadeOut(100);
			// 实现的显示
			$(this).find(".music_time>span").stop().fadeIn(100);
		});
		
		// 监听复选框的点击
		$(".paly_list").delegate(".music_checked","click",function(){
			// 添加选中的背景
			$(this).find("i").toggleClass("checked");
		})
	
		// 播放状态的改变
		$(".paly_list").delegate(".music_play1","click",function(){
			// 谁调用的方法this就是谁
			var $item = $(this).parents(".music_passage");
			// 其他字体不变亮
			$item.siblings().find("div").css("color","rgba(255,255,255,0.5)");
			// 其他小图标的还原
			$item.siblings().find(".music_play1").removeClass("music_play2");
			// 播放小图标的改变
			$(this).toggleClass("music_play2");
			// 判断当前小图标的状态
			if($(this).attr("class").indexOf("music_play2")!=-1){
				// 当前小图标正在播放时，大图标播放
				$(".play_pause").addClass("play_pause2");
				// 字体变亮
				$item.find("div").css("color","#fff");
			}else{
				// 当前小图标暂停时，大图标暂停
				$(".play_pause").removeClass("play_pause2");
				// 字体还原
				$item.find("div").css("color","rgba(255,255,255,0.5)");
			}
			// 在播放时隐藏序号，改为播放动画
			$item.siblings().find(".music_number").removeClass("music_number2");
			$item.find(".music_number").toggleClass("music_number2");
			// 播放音乐
			playerxsh.playMusic($item.get(0).index,$item.get(0).music);
			// 带有参数，取得所有匹配的DOM元素数组中指定的一个匹配的元素。
			// console.log($item.get(0).index,$item.get(0).music.link_url);
			InitMusicInfo($item.get(0).music);
		});
		
	}
	// 监听底部播放，暂停按钮的点击
	$(".play_pause").click(function(){
		if(playerxsh.current == -1){
			// 没有播放过音乐
			$(".music_passage").eq(0).find(".music_play1").trigger("click");
		} else{
			// 已经播放过音乐
			$(".music_passage").eq(playerxsh.current).find(".music_play1").trigger("click");
		}
	});
	// 监听底部上一首按钮的点击
	$(".play_previous").click(function(){
		$(".music_passage").eq(playerxsh.play_previous()).find(".music_play1").trigger("click");
		// trigger() 方法触发被选元素上指定的事件以及事件的默认行为
	})
	// 监听底部下一首按钮的点击
	$(".play_next").click(function(){
		$(".music_passage").eq(playerxsh.play_next()).find(".music_play1").trigger("click");
	})
	// 监听删除按钮的点击
	$(".paly_list").delegate(".music_delete","click",function(){
		var $item = $(this).parents(".music_passage");
		// 如果删除的是正在播放的
		if($item.get(0).index == playerxsh.current){
			// get得到的DOM对象，eq得到的jQuery对象
			$(".play_next").trigger("click");
		}
		$item.remove();
		playerxsh.changeMusic($item.get(0).index);
		// 重新排序
		$(".music_passage").each(function(index,ele){
			ele.index = index;
			$(ele).find(".music_number").text(index + 1);
		})
		// if($item.get(0).index < playerxsh.current){
		// 	playerxsh.current = playerxsh.current - 1;
		// }
	})
	// 监听播放的进度
	playerxsh.musicTimeUpData(function(duration,currentTime,timeStr){
		// 调整播放的时间
		$(".play_information_time").text(timeStr);
		// 调整进度条
		var value = currentTime / duration * 100;
		progress.setProgress(value);
	})
	// 监听声音按钮的点击
	$(".play_voice_iconfont").click(function(){
		// 图标的切换
		$(this).toggleClass("play_voice_iconfont2");
		if($(this).attr("class").indexOf("play_voice_iconfont2") != -1){
			// 设置没有声音		
			playerxsh.musicVoiceSeekTo(0);
		} else{
			// 设置有声音
			playerxsh.musicVoiceSeekTo(1);
		}
	})
	function createMusicItem(index,music){
		var $item = $("<li class=\"music_passage\">\n"+
									"<div class=\"music_checked\"><i></i></div>\n"+
									"<div class=\"music_number\">"+(index+1)+"</div>\n"+
									"<div class=\"music_name\">"+music.name+"\n"+
										"<div class=\"list_menu\">\n"+
											"<a href=\"javascript:;\" title=\"播放\" class=\"music_play1\"></a>\n"+
											"<a href=\"javascript:;\" title=\"添加\"></a>\n"+
											"<a href=\"javascript:;\" title=\"下载\"></a>\n"+
											"<a href=\"javascript:;\" title=\"分享\"></a>\n"+
										"</div>\n"+
									"</div>\n"+
									"<div class=\"music_player\">"+music.singer+"</div>\n"+
									"<div class=\"music_time\">\n"+
										"<span>"+music.time+"</span>\n"+
										"<a href=\"javascript:;\" title=\"删除\" class=\"music_delete\"></a>\n"+
									"</div>\n"+
								"</li>");
								$item.get(0).index = index;
								$item.get(0).music = music;
	    return $item;
	}
});