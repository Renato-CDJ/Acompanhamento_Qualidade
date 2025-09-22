// Chart.js wrapper component for compatibility
export class Chart {
  constructor(ctx, config) {
    // This is a wrapper for Chart.js library
    return new window.Chart(ctx, config)
  }
}

// Default export for compatibility
export default Chart
