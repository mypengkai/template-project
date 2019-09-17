<template>
  <div id="broken"></div>
</template>

<script>
  import echarts from 'echarts'
  import homePage from '@/api/homePage.js'

  export default {
    mounted() {
      this.statistics()
    },
    methods: {
      statistics() {
        homePage.getUserMessage().then(res => {
          let testData = res.data.data // 取整个数组
          console.log('testdata', testData)
          let command = testData.command
          let meeting = testData.meeting
          let polling = testData.polling
          let process = testData.process
          let sideStation = testData.sideStation
          let testDataX = ['工序验收', '巡视', '旁站', '指令', '变更纪要']
          let testDataY = [process, polling, sideStation, command, meeting]

          this.ioi(testDataX, testDataY)
        })
      },
      ioi(testDataX, testDataY) {
        let broken = echarts.init(document.getElementById('broken'))
        var xData = testDataX
        let option = {
          title: {
            text: '任务统计',
            x: '2',
            textStyle: {
              color: '#000',
              fontSize: '18'
            },
            subtextStyle: {
              color: '#90979c',
              fontSize: '16'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              textStyle: {
                color: '#fff'
              }
            }
          },
          grid: {
            borderWidth: 0,
            left: 80,
            right: 10,
            top: 50,
            bottom: 95,
            textStyle: {
              color: '#fff'
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#90979c'
                }
              },
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              splitArea: {
                show: false
              },
              axisLabel: {
                interval: 0
              },
              data: xData
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#90979c'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0
              },
              splitArea: {
                show: false
              }
            }
          ],
          // X滚动轴
          dataZoom: [
            {
              show: false,
              height: 30,
              xAxisIndex: [0],
              bottom: 30,
              start: 10,
              end: 280,
              handleIcon:
                'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
              handleSize: '100%',
              handleStyle: {
                color: '#d3dee5'
              },
              textStyle: {
                color: '#000'
              },
              borderColor: '#90979c'
            },
            {
              type: 'inside',
              show: true,
              height: 15,
              start: 1,
              end: 35
            }
          ],
          series: [
            {
              name: '次数',
              type: 'bar',
              stack: '总量',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: 'rgba(0,191,183,1)',
                  barBorderRadius: 0,
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function(p) {
                      return p.value > 0 ? p.value : ''
                    }
                  }
                }
              },
              data: testDataY
            }
          ]
        }
        broken.setOption(option)
      }
    }
  }
</script>

<style lang="scss" scoped>
  #broken {
    width: 50%;
    height: 100%;
  }
</style>
