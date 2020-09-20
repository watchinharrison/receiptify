(function () {
	/**
	 * Obtains parameters from the hash of the URL
	 * @return Object
	 */

	var displayName = 'RECEIPTIFY';
	var dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	var today = new Date();
	function getHashParams() {
		var hashParams = {};
		var e,
			r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while ((e = r.exec(q))) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}

	var userProfileSource = document.getElementById('user-profile-template').innerHTML,
		userProfileTemplate = Handlebars.compile(userProfileSource),
		userProfilePlaceholder = document.getElementById('receipt');

	var params = getHashParams();

	var access_token = params.access_token,
		refresh_token = params.refresh_token,
		error = params.error;

	if (error) {
		alert('There was an error during the authentication');
	} else {
		if (access_token) {
			$.ajax({
				url: 'https://api.spotify.com/v1/me',
				headers: {
					Authorization: 'Bearer ' + access_token
				},
				success: function (response) {
					displayName = response.display_name.toUpperCase();
					$('#login').hide();
					$('#loggedin').show();
				}
			});
		} else {
			// render initial screen
			$('#login').show();
			$('#loggedin').hide();
		}

		document.getElementById('short-term').addEventListener(
			'click',
			function () {
				$.ajax({
					url: 'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term',
					headers: {
						Authorization: 'Bearer ' + access_token
					},
					success: function (response) {
						var data = {
							trackList: response.items,
							total: 0,
							date: today.toLocaleDateString('en-US', dateOptions).toUpperCase(),
							json: true
						};
						for (var i = 0; i < data.trackList.length; i++) {
							data.trackList[i].name = data.trackList[i].name.toUpperCase();
							data.total += data.trackList[i].duration_ms;
							let minutes = Math.floor(data.trackList[i].duration_ms / 60000);
							let seconds = ((data.trackList[i].duration_ms % 60000) / 1000).toFixed(0);
							data.trackList[i].duration_ms = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
							for (var j = 0; j < data.trackList[i].artists.length; j++) {
								data.trackList[i].artists[j].name = data.trackList[i].artists[j].name.trim();
								data.trackList[i].artists[j].name = data.trackList[i].artists[j].name.toUpperCase();
								if (j != data.trackList[i].artists.length - 1) {
									data.trackList[i].artists[j].name = data.trackList[i].artists[j].name + ', ';
								}
							}
						}
						minutes = Math.floor(data.total / 60000);
						seconds = ((data.total % 60000) / 1000).toFixed(0);
						data.total = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
						userProfilePlaceholder.innerHTML = userProfileTemplate({
							tracks: data.trackList,
							total: data.total,
							time: data.date,
							num: 1,
							name: displayName,
							period: 'LAST MONTH'
						});

						document.getElementById('download').addEventListener('click', function () {
							var offScreen = document.querySelector('.receiptContainer');

							window.scrollTo(0, 0);
							// Use clone with htm2canvas and delete clone
							html2canvas(offScreen).then((canvas) => {
								var dataURL = canvas.toDataURL();
								console.log(dataURL);
								var link = document.createElement('a');
								link.download = 'short_term_receiptify.png';
								link.href = dataURL;
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
								delete link;
							});
						});
					}
				});
			},
			false
		);

		document.getElementById('medium-term').addEventListener(
			'click',
			function () {
				$.ajax({
					url: 'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=medium_term',
					headers: {
						Authorization: 'Bearer ' + access_token
					},
					success: function (response) {
						var data = {
							trackList: response.items,
							total: 0,
							date: today.toLocaleDateString('en-US', dateOptions).toUpperCase(),
							json: true
						};
						for (var i = 0; i < data.trackList.length; i++) {
							data.trackList[i].name = data.trackList[i].name.toUpperCase();
							data.total += data.trackList[i].duration_ms;
							let minutes = Math.floor(data.trackList[i].duration_ms / 60000);
							let seconds = ((data.trackList[i].duration_ms % 60000) / 1000).toFixed(0);
							data.trackList[i].duration_ms = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
							for (var j = 0; j < data.trackList[i].artists.length; j++) {
								data.trackList[i].artists[j].name = data.trackList[i].artists[j].name.trim();
								data.trackList[i].artists[j].name = data.trackList[i].artists[j].name.toUpperCase();
								if (j != data.trackList[i].artists.length - 1) {
									data.trackList[i].artists[j].name = data.trackList[i].artists[j].name + ', ';
								}
							}
						}
						minutes = Math.floor(data.total / 60000);
						seconds = ((data.total % 60000) / 1000).toFixed(0);
						data.total = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
						userProfilePlaceholder.innerHTML = userProfileTemplate({
							tracks: data.trackList,
							total: data.total,
							time: data.date,
							num: 2,
							name: displayName,
							period: 'LAST 6 MONTHS'
						});
						document.getElementById('download').addEventListener('click', function () {
							var offScreen = document.querySelector('.receiptContainer');

							window.scrollTo(0, 0);
							// Use clone with htm2canvas and delete clone
							html2canvas(offScreen).then((canvas) => {
								var dataURL = canvas.toDataURL();
								console.log(dataURL);
								var link = document.createElement('a');
								link.download = 'medium_term_receiptify.png';
								link.href = dataURL;
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
								delete link;
							});
						});
					}
				});
			},
			false
		);

		document.getElementById('long-term').addEventListener(
			'click',
			function () {
				$.ajax({
					url: 'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=long_term',
					headers: {
						Authorization: 'Bearer ' + access_token
					},
					success: function (response) {
						var data = {
							trackList: response.items,
							total: 0,
							date: today.toLocaleDateString('en-US', dateOptions).toUpperCase(),
							json: true
						};
						for (var i = 0; i < data.trackList.length; i++) {
							data.trackList[i].name = data.trackList[i].name.toUpperCase();
							data.total += data.trackList[i].duration_ms;
							let minutes = Math.floor(data.trackList[i].duration_ms / 60000);
							let seconds = ((data.trackList[i].duration_ms % 60000) / 1000).toFixed(0);
							data.trackList[i].duration_ms = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
							for (var j = 0; j < data.trackList[i].artists.length; j++) {
								data.trackList[i].artists[j].name = data.trackList[i].artists[j].name.trim();
								data.trackList[i].artists[j].name = data.trackList[i].artists[j].name.toUpperCase();
								if (j != data.trackList[i].artists.length - 1) {
									data.trackList[i].artists[j].name = data.trackList[i].artists[j].name + ', ';
								}
							}
						}
						minutes = Math.floor(data.total / 60000);
						seconds = ((data.total % 60000) / 1000).toFixed(0);
						data.total = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
						userProfilePlaceholder.innerHTML = userProfileTemplate({
							tracks: data.trackList,
							total: data.total,
							time: data.date,
							num: 3,
							name: displayName,
							period: 'ALL TIME'
						});
						document.getElementById('download').addEventListener('click', function () {
							var offScreen = document.querySelector('.receiptContainer');

							window.scrollTo(0, 0);
							// Use clone with htm2canvas and delete clone
							html2canvas(offScreen).then((canvas) => {
								var dataURL = canvas.toDataURL();
								console.log(dataURL);
								var link = document.createElement('a');
								link.download = 'long_term_receiptify.png';
								link.href = dataURL;
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
								delete link;
							});
						});
					}
				});
			},
			false
		);
	}
})();
