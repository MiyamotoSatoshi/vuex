export default {
  header: 'Touch Support',
  headerText: 'The <code>v-touch</code> directive allows you to capture swipe gestures and apply directional callbacks.',
  props: {
    '[up, down, left, right]': 'Assign a callback based upon a swipe direction. Pairing x-axis and y-axis callbacks is not recommended at this time',
    '[move, start, end]': 'Assign a callback when the touch event starts, ends, and while it is in progress'
  }
}
