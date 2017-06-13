export default {
  methods: {
    genTBody () {
      let children = []

      if (!this.itemsLength) {
        children = [this.genEmptyBody(this.noDataText)]
      } else if (!this.filteredItems.length) {
        children = [this.genEmptyBody(this.noResultsText)]
      } else {
        children = this.filteredItems.map((item, index) => {
          const props = { item, index }

          Object.defineProperty(props, 'selected', {
            get: () => this.selected[item[this.selectedKey]],
            set: (value) => {
              let selected = this.value.slice()
              value && selected.push(item) || (selected = selected.filter(i => i[this.selectedKey] !== item[this.selectedKey]))
              this.$emit('input', selected)
            }
          })

          const row = this.$scopedSlots.items(props)

          if (row.length && row[0].tag === 'tr') {
            return row
          } else {
            return this.genTR(row, { attrs: { active: this.isSelected(item) } })
          }
        })
      }

      return this.$createElement('tbody', children)
    },
    genEmptyBody (text) {
      return this.genTR([this.$createElement('td', {
        'class': 'text-xs-center',
        attrs: { colspan: '100%' }
      }, text)])
    }
  }
}
