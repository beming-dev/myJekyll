---
typora-copy-images-to: github blog\beming-dev.github.io\assets\images
typora-root-url: github blog\beming-dev.github.io
---



지난 시간에 라즈베리 파이에 Ubuntu server를 OS로 설치했다. 이제 이 위에다 NodeJS, NPM을 설치해서 서버로 사용해도 되지만, 이 위에다 Docker를 설치해서 사용해보기로 했다.

# Docker란 무엇인가?

Docker는 Linux위에서 프로세스들을 컨테이너에 배치시켜주는 가상화 도구이다.

컨테이너란 운영 체제 수준에서 지원하는 가상화 방식을 말한다. 

운영 체제 수준에서 가상화 방식을 지원하면, 따로 운영 체제가 필요한 그냥 가상화 방식(Virtual Machine)과는 달리 가상 환경을 실행하는 데에 필요한 라이브러리와 도구만 있으면 하나의 커널을 공유해서 여러 가상 환경을 실행할 수 있다. 

컨테이너를 생성하기 위해 이미지라는 것을 사용하는데, 이미지란 가상 환경을 실행하기 위해 필요한 내용을 적어둔 파일을 말하고, 이 이미지를 실행함으로써 컨테이너가 생성된다. Docker file을 통해서 만들 수도 있고, Docker hub에서 다운받아 사용할 수도 있다.

컨테이너를 사용하면 운영체제 전부를 이미지에 포함할 필요가 없기 때문에 훨씬 적은 용량의 이미지로 더 빠르게 가상 환경을 만들어서 사용할 수 있다. 

### Docker의 장점

동일한 Docker이미지를 만들어 놓으면 다른 사람에게 같은 환경을 공유할 수 있고, 서비스를 배포할 때에도 사용자 OS에 상관없이 동일한 환경을 제공할 수 있어서 배포에 매우 유리하다.

# 설치

1. Ubuntu Server가 설치된 Raspberry server에 접속한다.

2. ```
   sudo apt update
   sudo apt upgrade
   sudo apt install docker.io
   ```

   위 세 명령어를 차례로 실행하면 docker가 설치된다.

이제 Portainer라는 Docker를 관리하는 webUI를 다운로드 할건데, 필수는 아니다. 대신 Portainer를 사용하면 터미널로 Docker를 사용하지 않아도 된다.

3. ```
   mkdir -p /data/portainer
   ```

   다음 명령어를 실행해서 폴더를 생성.

4. ```
   docker run --name portainer -p 9000:9000 -d --restart always -v /data/portainer:/data -v /var/run/docker.sock:/var/run/docker.sock portainer/portainer
   ```

   포터이너의 이미지를 다운로드 후 마운트 하는 명령어.

   - -p n:m => 외부에서 n번 포트로 접속했을 때, 내부의 m번 포트로 연결
   - -d => 백그라운드 실행
   - -v /data => 호스트와 컨테이너 볼륨 매칭, docker.sock 공유
   - portainer/portainer => portainer/portainer이미지 사용

   

5. 이제 라즈베리파이IP:9000주소로 브라우저에서 접속하면 아래와 같은 화면이 나온다.![화면 캡처 2021-04-01 111341](/assets/images/화면 캡처 2021-04-01 111341-1617243440567.png)

6. 자신의 pw로 create user를 하고 다음 창에서 Local을 선택하여 connect한다.

7. 이제 이미지를 다운받기 위해 Docker Hub에 접속한 후 Ubuntu를 검색한다. ![화면 캡처 2021-04-01 111955](/assets/images/화면 캡처 2021-04-01 111955.png)