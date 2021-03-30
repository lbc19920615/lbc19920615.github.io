//获取数组中的最小值
function arr_min(arr) {
  var min = arr[0]
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i]
    }
  }
  return min
}

function MoveModule(controller) {
  var raycaster = new THREE.Raycaster() //光线碰撞检测器
  var mouse = new THREE.Vector2() //存储鼠标坐标或者触摸坐标
  var isRotating = false //魔方是否正在转动
  var intersect //碰撞光线穿过的元素
  var normalize //触发平面法向量
  var startPoint //触发点
  var movePoint
  //魔方转动的六个方向
  var xLine = new THREE.Vector3(1, 0, 0) //X轴正方向
  var xLineAd = new THREE.Vector3(-1, 0, 0) //X轴负方向
  var yLine = new THREE.Vector3(0, 1, 0) //Y轴正方向
  var yLineAd = new THREE.Vector3(0, -1, 0) //Y轴负方向
  var zLine = new THREE.Vector3(0, 0, 1) //Z轴正方向
  var zLineAd = new THREE.Vector3(0, 0, -1) //Z轴负方向

  // const DIRECTION_Z_CLOCKWISE = 0.1
  // const DIRECTION_Y_COUNTERCLOCKWISE = 0.2
  // const DIRECTION_Y = 0.2

  //获得旋转方向
  function getDirection(vector3) {
    var direction
    //判断差向量和x、y、z轴的夹角
    var xAngle = vector3.angleTo(xLine)
    var xAngleAd = vector3.angleTo(xLineAd)
    var yAngle = vector3.angleTo(yLine)
    var yAngleAd = vector3.angleTo(yLineAd)
    var zAngle = vector3.angleTo(zLine)
    var zAngleAd = vector3.angleTo(zLineAd)
    var minAngle = arr_min([xAngle, xAngleAd, yAngle, yAngleAd, zAngle, zAngleAd]) //最小夹角

    switch (minAngle) {
      case xAngle:
        direction = 0 //向x轴正方向旋转90度（还要区分是绕z轴还是绕y轴）
        if (normalize.equals(yLine)) {
          direction = direction + 0.1 //绕z轴顺时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 0.2 //绕z轴逆时针
        } else if (normalize.equals(zLine)) {
          direction = direction + 0.3 //绕y轴逆时针
        } else {
          direction = direction + 0.4 //绕y轴顺时针
        }
        break
      case xAngleAd:
        direction = 1 //向x轴反方向旋转90度
        if (normalize.equals(yLine)) {
          direction = direction + 0.1 //绕z轴逆时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 0.2 //绕z轴顺时针
        } else if (normalize.equals(zLine)) {
          direction = direction + 0.3 //绕y轴顺时针
        } else {
          direction = direction + 0.4 //绕y轴逆时针
        }
        break
      case yAngle:
        direction = 2 //向y轴正方向旋转90度
        if (normalize.equals(zLine)) {
          direction = direction + 0.1 //绕x轴逆时针
        } else if (normalize.equals(zLineAd)) {
          direction = direction + 0.2 //绕x轴顺时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 0.3 //绕z轴逆时针
        } else {
          direction = direction + 0.4 //绕z轴顺时针
        }
        break
      case yAngleAd:
        direction = 3 //向y轴反方向旋转90度
        if (normalize.equals(zLine)) {
          direction = direction + 0.1 //绕x轴顺时针
        } else if (normalize.equals(zLineAd)) {
          direction = direction + 0.2 //绕x轴逆时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 0.3 //绕z轴顺时针
        } else {
          direction = direction + 0.4 //绕z轴逆时针
        }
        break
      case zAngle:
        direction = 4 //向z轴正方向旋转90度
        if (normalize.equals(yLine)) {
          direction = direction + 0.1 //绕x轴顺时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 0.2 //绕x轴逆时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 0.3 //绕y轴顺时针
        } else {
          direction = direction + 0.4 //绕y轴逆时针
        }
        break
      case zAngleAd:
        direction = 5 //向z轴反方向旋转90度
        if (normalize.equals(yLine)) {
          direction = direction + 0.1 //绕x轴逆时针
        } else if (normalize.equals(yLineAd)) {
          direction = direction + 0.2 //绕x轴顺时针
        } else if (normalize.equals(xLine)) {
          direction = direction + 0.3 //绕y轴逆时针
        } else {
          direction = direction + 0.4 //绕y轴顺时针
        }
        break
      default:
        break
    }
    return direction
  }

  //根据方向获得运动元素
  function getBoxs(target, direction) {
    var targetId = target.object.cubeIndex
    var ids = []
    for (var i = 0; i < cubes.length; i++) {
      ids.push(cubes[i].cubeIndex)
    }
    var minId = arr_min(ids)
    targetId = targetId - minId
    var numI = parseInt(targetId / 9)
    var numJ = targetId % 9
    var boxs = []
    //根据绘制时的规律判断 no = i*9+j
    switch (direction) {
      //绕z轴
      case 0.1:
      case 0.2:
      case 1.1:
      case 1.2:
      case 2.3:
      case 2.4:
      case 3.3:
      case 3.4:
        for (var i = 0; i < cubes.length; i++) {
          var tempId = cubes[i].cubeIndex - minId
          if (numI === parseInt(tempId / 9)) {
            boxs.push(cubes[i])
          }
        }
        break
      //绕y轴
      case 0.3:
      case 0.4:
      case 1.3:
      case 1.4:
      case 4.3:
      case 4.4:
      case 5.3:
      case 5.4:
        for (var i = 0; i < cubes.length; i++) {
          var tempId = cubes[i].cubeIndex - minId
          if (parseInt(numJ / 3) === parseInt((tempId % 9) / 3)) {
            boxs.push(cubes[i])
          }
        }
        break
      //绕x轴
      case 2.1:
      case 2.2:
      case 3.1:
      case 3.2:
      case 4.1:
      case 4.2:
      case 5.1:
      case 5.2:
        for (var i = 0; i < cubes.length; i++) {
          var tempId = cubes[i].cubeIndex - minId
          if ((tempId % 9) % 3 === numJ % 3) {
            boxs.push(cubes[i])
          }
        }
        break
      default:
        break
    }
    return boxs
  }

  //获取操作焦点以及该焦点所在平面的法向量
  function getIntersects(event) {
    //触摸事件和鼠标事件获得坐标的方式有点区别
    if (event.touches) {
      var touch = event.touches[0]
      mouse.x = (touch.clientX / width) * 2 - 1
      mouse.y = -(touch.clientY / height) * 2 + 1
    } else {
      mouse.x = (event.clientX / width) * 2 - 1
      mouse.y = -(event.clientY / height) * 2 + 1
    }
    raycaster.setFromCamera(mouse, camera)
    //Raycaster方式定位选取元素，可能会选取多个，以第一个为准
    var intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length) {
      try {
        if (intersects[0].object.cubeType === 'coverCube') {
          intersect = intersects[1]
          normalize = intersects[0].face.normal
        } else {
          intersect = intersects[0]
          normalize = intersects[1].face.normal
        }
      } catch (err) {
        //nothing
      }
    }
  }

  //绕着世界坐标系的某个轴旋转
  function rotateAroundWorldY(obj, rad) {
    var x0 = obj.position.x
    var z0 = obj.position.z
    /**
     * 因为物体本身的坐标系是随着物体的变化而变化的，
     * 所以如果使用rotateZ、rotateY、rotateX等方法，
     * 多次调用后就会出问题，先改为Quaternion实现。
     */
    var q = new THREE.Quaternion()
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rad)
    obj.quaternion.premultiply(q)
    //obj.rotateY(rad);
    obj.position.x = Math.cos(rad) * x0 + Math.sin(rad) * z0
    obj.position.z = Math.cos(rad) * z0 - Math.sin(rad) * x0
  }

  function rotateAroundWorldZ(obj, rad) {
    var x0 = obj.position.x
    var y0 = obj.position.y
    var q = new THREE.Quaternion()
    q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), rad)
    obj.quaternion.premultiply(q)
    //obj.rotateZ(rad);
    obj.position.x = Math.cos(rad) * x0 - Math.sin(rad) * y0
    obj.position.y = Math.cos(rad) * y0 + Math.sin(rad) * x0
  }

  function rotateAroundWorldX(obj, rad) {
    var y0 = obj.position.y
    var z0 = obj.position.z
    var q = new THREE.Quaternion()
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rad)
    obj.quaternion.premultiply(q)
    //obj.rotateX(rad);
    obj.position.y = Math.cos(rad) * y0 - Math.sin(rad) * z0
    obj.position.z = Math.cos(rad) * z0 + Math.sin(rad) * y0
  }

  //更新位置索引
  function updateCubeIndex(elements) {
    for (var i = 0; i < elements.length; i++) {
      var temp1 = elements[i]
      for (var j = 0; j < initStatus.length; j++) {
        var temp2 = initStatus[j]
        if (
          Math.abs(temp1.position.x - temp2.x) <= cubeParams.len / 2 &&
          Math.abs(temp1.position.y - temp2.y) <= cubeParams.len / 2 &&
          Math.abs(temp1.position.z - temp2.z) <= cubeParams.len / 2
        ) {
          temp1.cubeIndex = temp2.cubeIndex
          break
        }
      }
    }
  }

  /**
   * 旋转动画
   */
  function rotateAnimation(
    elements,
    direction,
    currentstamp,
    startstamp,
    laststamp
  ) {
    var totalTime = 500 //转动的总运动时间
    if (startstamp === 0) {
      startstamp = currentstamp
      laststamp = currentstamp
    }
    if (currentstamp - startstamp >= totalTime) {
      currentstamp = startstamp + totalTime
      isRotating = false
      startPoint = null
      updateCubeIndex(elements)
    }
    switch (direction) {
      //绕z轴顺时针
      case 0.1:
      case 1.2:
      case 2.4:
      case 3.3:
        for (var i = 0; i < elements.length; i++) {
          rotateAroundWorldZ(
            elements[i],
            (((-90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕z轴逆时针
      case 0.2:
      case 1.1:
      case 2.3:
      case 3.4:
        for (var i = 0; i < elements.length; i++) {
          rotateAroundWorldZ(
            elements[i],
            (((90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕y轴顺时针
      case 0.4:
      case 1.3:
      case 4.3:
      case 5.4:
        for (var i = 0; i < elements.length; i++) {
          rotateAroundWorldY(
            elements[i],
            (((-90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕y轴逆时针
      case 1.4:
      case 0.3:
      case 4.4:
      case 5.3:
        for (var i = 0; i < elements.length; i++) {
          rotateAroundWorldY(
            elements[i],
            (((90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕x轴顺时针
      case 2.2:
      case 3.1:
      case 4.1:
      case 5.2:
        for (var i = 0; i < elements.length; i++) {
          rotateAroundWorldX(
            elements[i],
            (((90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      //绕x轴逆时针
      case 2.1:
      case 3.2:
      case 4.2:
      case 5.1:
        for (var i = 0; i < elements.length; i++) {
          rotateAroundWorldX(
            elements[i],
            (((-90 * Math.PI) / 180) * (currentstamp - laststamp)) / totalTime
          )
        }
        break
      default:
        break
    }
    if (currentstamp - startstamp < totalTime) {
      window.requestAnimationFrame(function (timestamp) {
        rotateAnimation(
          elements,
          direction,
          timestamp,
          startstamp,
          currentstamp
        )
      })
    }
  }

  //开始操作魔方
  function startCube(event) {
    getIntersects(event)
    //魔方没有处于转动过程中且存在碰撞物体
    if (!isRotating && intersect) {
      startPoint = intersect.point //开始转动，设置起始点
      controller.enabled = false //当刚开始的接触点在魔方上时操作为转动魔方，屏蔽控制器转动
    } else {
      controller.enabled = true //当刚开始的接触点没有在魔方上或者在魔方上但是魔方正在转动时操作转动控制器
    }
  }

  //滑动操作魔方
  function moveCube(event) {
    getIntersects(event)
    if (intersect) {
      if (!isRotating && startPoint) {
        //魔方没有进行转动且满足进行转动的条件
        movePoint = intersect.point
        if (!movePoint.equals(startPoint)) {
          //和起始点不一样则意味着可以得到转动向量了
          isRotating = true //转动标识置为true
          var sub = movePoint.sub(startPoint) //计算转动向量
          var direction = getDirection(sub) //获得方向
          var elements = getBoxs(intersect, direction)
         // var startTime = new Date().getTime()
          window.requestAnimationFrame(function (timestamp) {
            rotateAnimation(elements, direction, timestamp, 0)
          })
        }
      }
    }
    event.preventDefault()
  }

  //魔方操作结束
  function stopCube() {
    intersect = null
    startPoint = null
  }

  return {
    startCube,
    moveCube,
    stopCube,
  }
}
