---
layout: post
category: 디자인 패턴
thumbnail: design.png
tags: [desing pattern]


---

# 디자인 패턴 - 생성패턴

## 프로토타입 패턴(Prototype Pattern)

<br/>

<br/>

### 사용이유

프로토타입 패턴은 생성할 객체들의 타입을 프로토타입인 인스턴스로부터 결정되게 한다.

만약 우리가 object를 하나 가지고 있고 이의 복사본을 하나 만들고 싶다고 가정하자, 먼저 우리는 같은 class의 object를 하나 생성하고 원래 객체의 모든 field값을 복사해서 새 object에 붙여 넣을것이다.

그러나 여기에는 두가지 문제가 있다.

1. 몇가지 object의 field들은 private으로 선언되어 있어서 바깥에서 그 값을 볼 수 없다.
2. 복사본을 생성하려면, object의 class를 알아야 하기 때문에 의존성이 생긴다.

이런 문제들을 피하기 위해 프로토타입 패턴이 생겼다. 또한 프로토타입 패턴은 객체 생성에 비용이 많으드는 경우(db에 접근하는 경우 등)에도 유용하다.



### 예제

1. java에서는 Cloneable이라는 인터페이스를 제공하는데 이 인터페이스를 구현하여 clone메소드를 사용하면 복사된 instance를 반환해준다고 한다. Cloneable 인터페이스를 구현하지 않고 clone메소드를 호출하면 CloneNotSupportedException이 발생하므로 예외처리도 해주어야 한다고 한다.

   이를 활용해 Computer Class를 만들어준다.

```java
public class Computer implements Cloneable {
    private String SSD;
    private String RAM;
    private String CPU;
    
    public Computer(String SSD, String RAM, String CPU){
        this.SSD = SSD;
        this.RAM = RAM;
        this.CPU = CPU;
    }
    
    public String getSSD(){return SSD}
    public String getRAM(){return RAM}
    public String getCPU(){return CPU}
    
	public Object clone(){
        try{
            Computer copy = (Computer)super.clone();
            return copy;
        }
        catch(CloneNotSupportedException e){
            e.printStackTrace();
            return null;
        }
    }
}
```

2. Computer class를 상속받는 ComputerA와 ComputerB를 만든다. 이 둘은 DB로부터 정보를 가져와서 컴퓨터 부품을 구성한다고 하자.

```java
public class ComputerA extends Computer{
    public ComputerA(){
        //DB에서 값 가져온다 가정
        String SSD = "256GB";
        String RAM = "16GB";
        String CPU = "Intel 11";
        super(SSD, RAM, CPU);
    }
}

public class ComputerB extends Computer{
    public ComputerB(){
        //DB에서 값 가져온다 가정
        String SSD = "512GB";
        String RAM = "32GB";
        String CPU = "Intel 7";
        super(SSD, RAM, CPU);
    }
}
```

3. clone 메소드를 사용해서 객체를 복사한다.

```java
public class Client {
    public static void main(String args[]){
        Computer com1 = new ComputerA();
        Computer com2 = new ComputerB();
        
        Computer newCom = (Computer) com1.clone();
        
        System.out.println(newCom.getCPU);
        //Intel 11
    }
}

```

이렇게하면 DB에 접근하지 않고도 복사본을 만들 수 있고, 복사하려는 class의 내부도 알 필요가 없다.

# 끝

