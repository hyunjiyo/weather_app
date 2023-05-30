const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoTxt = inputPart.querySelector('.info-txt'),
inputFiled = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button'),
wIcon = wrapper.querySelector('.weather-part img'),
arrowBack = wrapper.querySelector('header i');


let api;

// 유저가 값이 공백이 아니고 (갑을 읿력) enter를 눌렀을 시
inputFiled.addEventListener('keyup', e => {  
  if (e.key == 'Enter' && inputFiled.value != ''){
    requestApi(inputFiled.value);
  }
});

// Geolocation API는 사용자의 지리적 위치를 파악하는데 사용
locationBtn.addEventListener('click', ()=>{
  if(navigator.geolocation){ // 브라우저가 위치 api를 지원하는 경우
    navigator.geolocation.getCurrentPosition(onSuccess, onError) // getCurrentPosition()는 사용자의 위치를 ​​반환하는 데 사용.
  }else{
    alert('사용자 위치 사용 불가')
  }
});

function onSuccess(position){
  const{latitude, longitude} = position.coords; // coords obj에서 사용자 장치의 위도 및 경도 가져오기
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=41e16d868e4c93c5d3f8cf073c146c1d`;
  fetchData();
}

function onError(error){
  infoTxt.innerText = error.message;
  infoTxt.classList.add('error');
}

function requestApi(city){
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=41e16d868e4c93c5d3f8cf073c146c1d`;
  fetchData();
}

function fetchData(){
  infoTxt.innerText = 'Getting weather details...';
  infoTxt.classList.add('pending');
  //api 응답을 받고 js obj 및 다른 파일로 분석하여 반환
  //api 결과를 인수로 전달하여 weatherDetails 함수를 호출
  fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
  infoTxt.classList.replace('pending', 'error');
  if(info.cod == "404"){
    infoTxt.innerText = `${inputFiled.value} 없는 지역입니다`;
  }else{
    // API obj에서 정보 추출
    const city = info.name;
    const country = info.sys.country;
    const {description, id} = info.weather[0];
    const {feels_like, humidity, temp} = info.main;

    // weather icon custom으로 변경
    if(id == 800){
      wIcon.src="img/clear.svg";
    }
    else if(id >= 200 && id <= 232){
      wIcon.src="img/storm.svg";
    }
    else if(id >= 600 && id <= 622){
      wIcon.src="img/snow.svg";
    }
    else if(id >= 701 && id <= 781){
      wIcon.src="img/haze.svg";
    }
    else if(id >= 801 && id <= 804){
      wIcon.src="img/cloud.svg";
    }
    else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src="img/rain.svg";
    }

    // html요소에 전달
    wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
    wrapper.querySelector('.weather').innerText = description;
    wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
    wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
    wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

    // API에서 데이터를 수신하면 보류 중인 메시지를 숨기고 날씨를 표시
    infoTxt.classList.remove('pending', 'error'); 
    wrapper.classList.add('active');
    console.log(info);
  }
}

// 뒤로가기
arrowBack.addEventListener('click', ()=>{
  wrapper.classList.remove('active');
})