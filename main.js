const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')

const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
	isRandom: false,
	isRepeat: false,
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
		{
			name: 'Waing For You',
			singer: 'Mono',
			path: './music/Waiting For You.mp3',
			image: 'https://avatar-ex-swe.nixcdn.com/song/share/2022/08/17/e/a/a/5/1660733423986.jpg',
		},
		{
			name: 'Như Những Phút Ban Đầu',
			singer: 'Hoài Lâm',
			path: './music/nhuphutbandau.mp3',
			image:
				'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/covers/7/c/7c6be286dd1c9831e37a14eca4016975_1467343706.jpg',
		},

		{
			name: '3107(Cover)',
			singer: '3107',
			path: './music/3107-Cover-Music-30-365.mp3',
			image: 'https://lyricvn.com/wp-content/uploads/2020/03/61b35411029c6156973232016738c1b7.jpg',
		},
		{
			name: 'Theres No One At All',
			singer: 'Sơn Tùng MTP',
			path: './music/Theres-No-One-At-All-Son-Tung-M-TP.mp3',
			image: 'https://cdnmedia.thethaovanhoa.vn/Upload/XmJnTp3BYsa9r8REW2g/files/2022/04/son-tung-m-tp.JPG',
		},
		{
			name: 'Buông Đôi Tay Nhau Ra',
			singer: 'Sơn Tùng MTP',
			path: './music/Buong-Doi-Tay-Nhau-Ra-Son-Tung-M-TP.mp3',
			image: 'https://upload.wikimedia.org/wikipedia/vi/c/c0/Buongdoitaynhauramtp.jpg',
		},
		{
			name: 'We Dont Talk Anymore',
			singer: 'Charlie Puth',
			path: './music/We Don_t Talk Anymore - Charlie Puth_ Se.mp3',
			image: 'https://upload.wikimedia.org/wikipedia/vi/8/89/Wedonttalkanymore.jpg',
		},
		{
			name: 'Anh Đã Quen Với Cô Đơn',
			singer: 'Soobin Hoàng Sơn',
			path: './music/Anh-Da-Quen-Voi-Co-Don-Soobin-Hoang-Son.mp3',
			image: 'https://i.scdn.co/image/ab67616d0000b2732922307c16bb852a0849bea0',
		},
		{
			name: 'Lần Cuối',
			singer: 'Karik',
			path: './music/Lan-Cuoi-Karik.mp3',
			image: 'https://avatar-ex-swe.nixcdn.com/song/2021/03/09/c/3/5/4/1615261605117.jpg',
		},
		{
			name: 'Say Do You',
			singer: 'Tiên Tiên',
			path: './music/Say-You-Do-Tien-Tien.mp3',
			image: 'https://imgt.taimienphi.vn/cf/Images/hi/2018/3/22/loi-bai-hat-say-you-do.jpg',
		},
		{
			name: 'Cơn Mưa Rào',
			singer: 'JSOL',
			path: './music/Con-Mua-Rao-JSOL.mp3',
			image: 'https://imgt.taimienphi.vn/cf/Images/hi/2018/6/22/loi-bai-hat-con-mua-rao.jpg',
		},
	],

	setConfig: function (key, value) {
		this.config[key] = value;
		LocalStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
	},

  render: function () { 
    const htmls = this.songs.map((song, index) =>{
      return `
      <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
        <div class="thumb" style="background-image: url('${song.image}')"></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`
    })
    playlist.innerHTML = htmls.join('\n')
  },

  defineProperties: function () {
		Object.defineProperty(this, 'currentSong', {
			get: function () {
				return this.songs[this.currentIndex];
			},
		});
	},

  handleEvents: function () {
    const cdWidth = cd.offsetWidth
		// to use 'this' of the inner function
		const _this = this;


		// CD Rotate
		const cdThumbAnimate = cdThumb.animate ([
				{ transform: 'rotate(360deg)' }
			], 
			{ 
				duration: 10000,
				iterations: Infinity
			})
		cdThumbAnimate.pause()

    // Handle scroll
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop

      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
      cd.style.opacity = newCdWidth / cdWidth
    }

    // Handle play btn
    playBtn.onclick = function () {
      if (audio.paused) {
        audio.play()
        player.classList.add('playing')
				cdThumbAnimate.play(); // start
      } else {
        audio.pause()
        player.classList.remove('playing')
				cdThumbAnimate.pause(); // stop
      }
    }

		// Set progress position
		audio.ontimeupdate = function () {
			if(audio.duration) {
				const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
				progress.value = progressPercent
			}
		}

		// Wind song
		progress.onchange = function(e) {
			const seekTime = audio.duration / 100 * e.target.value // e.target.value = percent
			audio.currentTime = seekTime
		}
		
		// Next song
		nextBtn.onclick = function () {
			if(_this.isRandom) {
				_this.randomSong();
			}
			else{
				_this.nextSong();
			}
			audio.play();
			_this.render();
			_this.scrollToActiveSong();
		}

		// Prev song
		prevBtn.onclick = function () {
			if(_this.isRandom) {
				_this.randomSong();
			}
			else{
				_this.prevSong();
			}
			audio.play();
			_this.render();
			_this.scrollToActiveSong();
		}

		// Random song
		randomBtn.onclick = function (e) {
			_this.isRandom = !_this.isRandom;
			if(_this.isRandom) _this.randomSong();
			_this.setConfig('isRandom', _this.isRandom);
			this.classList.toggle('active', _this.isRandom);
		}

		// Repeat song
		repeatBtn.onclick = function (e) {
			_this.isRepeat = !_this.isRepeat;
			if(_this.isRepeat) _this.repeatSong();
			_this.setConfig('isRepeat', _this.isRepeat);
			this.classList.toggle('active', _this.isRepeat);
		}
		
		// Next song while audio ended
		audio.onended = function () {
			if(_this.isRepeat) {
				audio.play();
			}
			else{
				nextBtn.click();
			}
		}

		playlist.onclick = function (e) {
			const songNode = e.target.closest('.song:not(.active)')
			if (songNode || e.target.closest('.option')) {
				if (songNode) {
					_this.currentIndex = Number(songNode.dataset.index)
					_this.loadCurrentSong()
					_this.render()
					audio.play()
				}
			}
		}
	},

	// Control bar functions
  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
		cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
		audio.src = this.currentSong.path;
  },

	loadConfig: function () {
		this.isRandom = this.config.isRandom;
		this.isRepeat = this.config.isRepeat;
	},

	nextSong: function () {
		this.currentIndex++
		if (this.currentIndex > this.songs.length - 1) {
			this.currentIndex = 0;
		}
		this.loadCurrentSong();
	},

	prevSong: function () {
		this.currentIndex--
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1;
		}
		this.loadCurrentSong();
	},

	randomSong: function() {
		let newIndex
		do {
			newIndex = Math.floor(Math.random() * this.songs.length)
		} while (newIndex === this.currentIndex)
		this.currentIndex = newIndex
		this.loadCurrentSong()
	},

	repeatSong: function() {
		audio.play();
	},

	scrollToActiveSong: function() {
		setTimeout(() => {
			$('.song.active').scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			})
		}, 300)
	},

  start: function() {
		// Load config
		this.loadConfig();

    // Define properties for object
    this.defineProperties();

    // Listen and handle DOM events
    this.handleEvents();

    // Load current song to the UI
    this.loadCurrentSong()
    
    // Render playlist
    this.render();

		// Get initial of repeat and random
		randomBtn.classList.toggle('active', this.isRandom);
		repeatBtn.classList.toggle('active', this.isRepeat);
  }
}

app.start()