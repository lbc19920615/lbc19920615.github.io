
# react native 采坑

## 0.62.2版本下解决Could not initialize class*InvokerHelper或*.groovy.vmplugin.v7.Java7


0.62.2版本下解决Could not initialize class*InvokerHelper或*.groovy.vmplugin.v7.Java7

```
 解决方案如下：

 到项目的 android/gradle/wrapper/gradle-wrapper.properties 

 将   distributionUrl=https\://services.gradle.org/distributions/gradle-6.0.1-all.zip

 改为：distributionUrl=https\://services.gradle.org/distributions/gradle-6.3-all.zip

```