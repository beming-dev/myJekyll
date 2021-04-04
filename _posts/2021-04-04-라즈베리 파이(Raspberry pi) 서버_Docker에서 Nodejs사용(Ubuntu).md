---
layout: post
category: 라즈베리파이
thumbnail: 라즈베리파이.png
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

2. ```shell
   sudo apt update
   sudo apt upgrade
   sudo apt install docker.io
   ```

   위 세 명령어를 차례로 실행하면 docker가 설치된다.

3. 아래 명령어들로 docker가 잘 설치됐는지 확인할 수 있다.

   ```shell
   docker -v
   docker run hello-world
   ```

   docker run hello-world를 했을때, hello-world 이미지가 다운로드 되고 아래와 같이 나오면 성공이다.

   <img src="/assets/images/화면 캡처 2021-04-04 200644.png"/>

4. 다음으로 nodejs와 npm을 설치해야 한다.

   최신버전을 설치하기 위해서는 wget명령어에 다운로드 링크를 걸어준 다음, 압축을 해제해서 하면 설치가 된다고 했는데 이상하게도 다 따라했는데 node -v 명령어가 반응이 없어서 급한대로 sudo apt 명령어로 설치했다.

   이 명령어로는 최신버전이 설치되지 않는다.

   ```shell
   sudo apt-get install nodejs
   sudo apt-get install npm

   #설치 됐는지 확인
   node -v
   npm -v
   ```

5. 작업할 디렉토리를 하나 만들고 거기로 이동한다. 앞으로 이 위에서 작업할 것이다.

   ```shell
   mkdir docker-nodeapp
   cd docker-nodeapp
   ```

6. 이제 nodejs를 사용하기 위한 환경을 만들어보자.

   ```shell
   npm init 		#package.json파일 생성됨
   npm install express -save
   ```

7. nodejs, express가 잘 되는지 확인하기 확인하기 위해 hello world를 띄워주는 서버를 만들어보자.

   현재 작업 디렉토리에 app.js파일을 만들고 다음과 같이 입력한다.

   ```javascript
   let express = require(‘express’);
   let app = express();
   app.get(‘/’, function (req, res) {
   	res.send(‘Hello World!’);
   });
   app.listen(8081, function () {
       console.log(‘app listening on port 8081!’);
   });
   ```

8. node app.js 명령어를 실행한 후, "라즈베리파이IP:8081"로 접속했을 때 hello world 화면이 뜨면 성공이다.

   종료는 ctrl + c로 하면 된다.

9. 이제 docker image로 서버를 띄워보자. 작업 디렉토리 에서

   ```shell
   touch Dockerfile
   ```

   명령어를 실행하면 Dockerfile이라는 파일이 생길 것이다. 참고로 shell에

   ```shell
   ls
   ```

   명령어를 통해 현재 디렉토리의 파일을 확인할 수 있다. 리눅스 명령어를 모르면 ubuntu를 사용할 수 없으니 linux명령어부터 공부 해야한다.

10. Dockerfile은 실행하면 Docker image가 되는 파일이다. Dockerfile에 사용하는 명령어는 구글링을 통해 또 공부해야 한다.

    일단 간단한 Dockerfile을 만들어 보자, Dockerfile을 열고

    ```dockerfile
    FROM node:12
    WORKDIR /app
    COPY package.json /app
    RUN npm install
    COPY . .
    CMD node app.js
    EXPOSE 8081
    ```

    이렇게 입력해준다.

11. 추가로 .dockerfile을 만들고

    ```
    node_modules npm-debug.log
    ```

    이렇게 입력하면 이미지를 만들 때, 이 파일에 적힌 내용은 Docker에 전달되지 않는다. .gitignore랑 비슷한것 같다.

12. Dockerfile을 실행해 이미지로 만들자.

    ```
    docker build -t docker-nodeapp .
    ```

    ```
    docker images
    ```

    로 이미지가 만들어진걸 확인할 수 있다. 이 과정에서 node:12 이미지도 설치된다.

13. 이제 만들어진 Docker image를 실행하고 아까처럼 라즈베리파이IP:8080에 접속하면 hello world가 뜰꺼다.

    ```
    docker run -p 8080:8081 -d docker-nodeapp .
    ```

    -p 8080:8081: 외부에서 8080포트로 접속하면 내부의8081포트로 접속

    -d: background 실행

# 오류

나는 13번 과정에서 이상한 오류가 났는데 해결하려다 주말이 다 갔다..

/usr/local/bin/docker-entrypoint.sh: 8: exex: .: Permission denied

당연히 Permission Denied니까 저 폴더로 가서 권한을 주면 해결할 수 있을 줄 알았는데,

/usr/local/bin에 갔더니 docker-entrypoint.sh가 없다.. 아무리 봐도 없다.. ls-al로 봐도 아무것도 없다..

정말 멘붕이 와서 엄청 구글링 했는데 나랑 비슷한 상황인 사람이 별로 없었다. Docker image가 다 다르기도 하고.

겨우 찾은 비슷한 상황인 사람이 Docker를 다시 설치했더니 해결됐다 해서 다시 설치해봤지만 그래도 똑같은 오류가 떴다.

별 짓을 다해도 안되던 중 Stack overflow에서 한 글의 엄청 밑에 추천 0개짜리 답글에 나랑 똑같은 상황인 사람이 있었다.

<img src="/assets/images/화면 캡처 2021-04-04 114317.png"/>

.. 난 주말동안 무얼 한 것이지..... 그냥 점을 뺐더니 됐다.

# 끝

여기까지 실행됐으면 이제 본인 서버를 띄우는 것도 문제가 없을 것이다(Dockerfile만 좀 공부한다면..).

사실 오늘안에 내 프로젝트도 라즈베리 파이에 올려서 실행해보고 싶었는데, Database가 노트북에 있고 노트북은 회사에 있어서 못했다ㅠㅠ. 내일 가서 DB보고 라즈베리파이에 똑같이 만들어야겠다. DB자체를 옮길 수 있는지는 아직 잘 모르겠다.

오류잡다가 주말이 다 가서 이번 주말은 별로 한게 없지만 그래도 다행히 오류도 잡고 프로젝트를 라즈베리 파이에 올릴 준비도 다 했으니 나름 뿌듯하다.
