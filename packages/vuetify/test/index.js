import Vue from 'vue'
import { mount, shallow } from 'avoriaz'
import Vuetify from '@/'
import toHaveBeenWarnedInit from '@/test/util/to-have-been-warned'
import { compileToFunctions } from 'vue-template-compiler'
toHaveBeenWarnedInit()

export function test(name, cb) {
  Vuetify.install(Vue)
/*
  const app = document.createElement('div')
  app.setAttribute('data-app', true)
  document.body.appendChild(app)
*/

  const runAllTimers = rafPolyfill(window)

  // Very naive polyfill for performance.now()
  window.performance = { now: () => (new Date()).getTime() }

  describe(name, () => cb({
    functionalContext,
    mount (component, options) {
      if (component.options) {
        component = component.options
      }
      return mount(component, {
        ...options,
        vuetify: new Vuetify()
      })
    },
    shallow (component, options) {
      if (component.options) {
        component = component.options
      }
      return shallow(component, {
        ...options,
        vuetify: new Vuetify()
      })
    },
    compileToFunctions,
    runAllTimers
  }))
}

test.skip = describe.skip

export function functionalContext(context = {}, children = []) {
  if (!Array.isArray(children)) children = [children]
  return {
    context: Object.assign({
      data: {},
      props: {}
    }, context),
    children
  }
}

//requestAnimationFrame polyfill | Milos Djakonovic ( @Miloshio ) | MIT | https://github.com/milosdjakonovic/requestAnimationFrame-polyfill
export function rafPolyfill(w) {
  /**
   *
   * How many times should polyfill call
   * update callback? By canon, it should
   * be 60 times per second, so that ideal
   * framerate 60fps could be reached.
   *
   * However, even native implementations
   * of requestAnimationFrame often cannot
   * do 60fps, but, unlike any polyfill,
   * they can synchronise achievable fps
   * rate with screen refresh rate.
   *
   * So, leave this value 1000/60 unless
   * you target specific browser on spec
   * ific device that is going to work
   * better with custom value. I think
   * that this is the longest comment I've
   * written on single variable so far.
  **/
  var FRAME_RATE_INTERVAL = 1000/60,

  /**
   * All queued callbacks in given cycle.
  **/
  allCallbacks = [],

  executeAllScheduled = false,

  shouldCheckCancelRaf = false,

  /**
   * Callbacks queued for cancellation.
  **/
  callbacksForCancellation = [],

  /**
   * Should callback be cancelled?
   * @param cb - callback
  **/
  isToBeCancelled = function(cb){
    for(var i=0;i<callbacksForCancellation.length;i++){
      if(callbacksForCancellation[i] === cb ){
        callbacksForCancellation.splice(i,1);
        return true;
      }
    }
  },



  /**
   *
   * Executes all (surprise) callbacks in
   * and removes them from callback queue.
   *
  **/
  executeAll = function(){
    executeAllScheduled = false;
    var _allCallbacks = allCallbacks;
    allCallbacks = [];
    for(var i=0;i<_allCallbacks.length;i++){
      if(shouldCheckCancelRaf===true){
        if (isToBeCancelled(_allCallbacks[i])){
          shouldCheckCancelRaf = false;
          return;
        }
      }
      _allCallbacks[i].apply(w, [ new Date().getTime() ] );
    }
  },

  /**
   *
   * requestAnimationFrame polyfill
   * @param callback - callback to be queued & executed | executed
   * @return callback
   *
  **/
  raf = function(callback){
    allCallbacks.push(callback);
    if(executeAllScheduled===false){
      w.setTimeout(executeAll, FRAME_RATE_INTERVAL);
      executeAllScheduled = true;
    }
    return callback;
  },

  /**
   *
   * Cancels raf.
  **/
  cancelRaf = function(callback){
    callbacksForCancellation.push(callback);
    shouldCheckCancelRaf = true;
  },


  //https://gist.github.com/paulirish/1579671
  vendors = ['ms', 'moz', 'webkit', 'o'];

    for(var x = 0; x < vendors.length && !w.requestAnimationFrame; ++x) {
        w.requestAnimationFrame = w[vendors[x]+'RequestAnimationFrame'];
        w.cancelAnimationFrame = w[vendors[x]+'CancelAnimationFrame']
        || w[vendors[x]+'CancelRequestAnimationFrame'];
    }

  if (!w.requestAnimationFrame) w.requestAnimationFrame = raf;
  if (!w.cancelAnimationFrame)  w.cancelAnimationFrame  = cancelRaf;

  // TODO remove requestAnimationFrame polyfill when jest will support it: https://github.com/facebook/jest/pull/7776
  function runAllTimers () {
    while (allCallbacks.length) {
      executeAll()
    }
  }

  return runAllTimers
}

export function touch(element) {
  const createTrigger = eventName => (clientX, clientY) => {
    const touches = [{ clientX, clientY }]
    const event = new Event(eventName)

    event.touches = touches
    event.changedTouches = touches
    element.element.dispatchEvent(event)

    return touch(element)
  }

  return {
    start: createTrigger('touchstart'),
    move: createTrigger('touchmove'),
    end: createTrigger('touchend')
  }
}

export const resizeWindow = (width = global.innerWidth, height = global.innerHeight) => {
  global.innerWidth = width
  global.innerHeight = height
  global.dispatchEvent(new Event('resize'))
  return new Promise(resolve => setTimeout(resolve, 200))
}

export const scrollWindow = (y) => {
  global.pageYOffset = y
  global.dispatchEvent(new Event('scroll'))

  return new Promise(resolve => setTimeout(resolve, 200))
}
