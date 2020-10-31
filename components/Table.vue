<template>
  <div v-if="table" class="doc-template">
    <div class="doc-header deep-purple darken-3">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn to="/" v-bind="attrs" v-on="on" icon dark tile class="doc-header__icon">
            <v-icon>mdi-file-table-box-multiple</v-icon>
          </v-btn>
        </template>
        <span>Список таблиц</span>
      </v-tooltip>

      <div class="doc-header__info">
        <div class="doc-header__input">
          <v-text-field v-model="table.table_name" name="TABLE_NAME" hide-details="auto" dark dense
                        @change="editName(table)"></v-text-field>

          <div v-show="autoLoadingMessage" class="doc-header__messages">
            <v-icon dark>mdi-message-alert-outline</v-icon>
            {{ autoLoadingMessage }}
          </div>
        </div>

        <div class="doc-header__actions">
          <v-speed-dial v-model="fab" direction="left">
            <template v-slot:activator>
              <v-btn v-model="fab" color="#fff" fab>
                <v-icon v-if="fab">mdi-close</v-icon>
                <v-icon v-else>mdi-cog</v-icon>
              </v-btn>
            </template>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="orange" fab x-small dark v-bind="attrs" v-on="on" @click="dialogNewTable = true">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Создать таблицу</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="success" fab x-small v-bind="attrs" v-on="on" @click="saveTable(table)">
                  <v-icon>mdi-content-save-edit</v-icon>
                </v-btn>
              </template>
              <span>Сохранить изменения</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="error" fab x-small v-bind="attrs" v-on="on" @click="deleteItem(table)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Удалить таблицу</span>
            </v-tooltip>
          </v-speed-dial>
        </div>
      </div>

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title>Действительно хотите удалить таблицу?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info" text @click="closeDelete">Нет</v-btn>
            <v-btn color="error" text @click="deleteItemConfirm">Удалить</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogNewTable" max-width="500px">
        <v-card>
          <v-card-title>Хотите создать новую таблицу?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="closeNewTable">Нет</v-btn>
            <v-btn color="success" text @click="newTableConfirm">Создать</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="table-layout" ref="tableLayout"
         :style="{ width: tableWidth ? tableWidth + 'px' : 'auto', maxWidth: '100%', height: tableHeight}">
      <div class="table" ref="table">
        <div class="table__header">
          <div class="table__th table__th_space"></div>
          <div v-for="theader in viewTable.headers" :key="theader.id" :data-col-id="theader.id" class="table__th"
               v-on:click="onSelectCol" v-bind:class="{'is-hover-col': activeCol === theader.id}">{{ theader.value }}
          </div>
        </div>
        <div v-for="vrow in viewTable.rows" :key="vrow.id" class="table__tr">
          <div class="table__td table__td_number" :data-row-id="vrow.id" @click="onSelectRow"
               v-bind:class="{'is-hover-row': activeRow === vrow.id}">{{ vrow.id + 1 }}
          </div>
          <div v-for="vcol in vrow.cols" :key="vcol.id" :data-col-id="vcol.id" :data-row-id="vrow.id" class="table__td"
               contenteditable="true" @focusout="updateColVal" @focusin="onCellSelect" @keydown="onCellKeyDown"
               v-bind:class="{'is-hover': selectedCell.colId === vcol.id && selectedCell.rowId === vrow.id,
               'is-hover-row': selectedRow === vrow.id,
               'is-hover-col': selectedCol === vcol.id}">
            {{ vcol.value }}
          </div>
        </div>
      </div>
      <div class="scroller-w" :style="{ width: totalWidth + 'px' }"></div>
    </div>

    <div v-show="showCalcPanel" class="panel-footer">
      <div class="panel-footer__content">
        <div class="function-box">
          <div class="function-box__title">Сумма:</div>
          {{ calc.sum }}
        </div>

        <div class="function-box">
          <div class="function-box__title">Среднее:</div>
          {{ calc.avg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {mapMutations} from 'vuex'

export default {
  props: {
    table: {
      type: Object,
      required: true,
      default: {}
    }
  },

  data() {
    return {
      dialogDelete: false,
      dialogNewTable: false,
      fab: false,
      editedItem: {},

      viewTable: {
        headers: [],
        rows: [{
          id: 1,
          cols: [{
            id: 1,
            value: ""
          }]
        }]
      },
      rowHeight: 25,
      colWidth: 150,
      firstIndex: 0,
      offsetHeight: 0,
      offsetWidth: 0,
      totalHeight: 0,
      totalWidth: 0,
      tableWidth: 0,
      tableHeight: 50,
      totalRows: 100,
      totalCols: 20,
      dataChanged: false,
      dataAutoSaved: true,
      autoLoadingMessage: '',
      lastUpdateDate: new Date(),

      activeCol: -1,
      activeRow: -1,
      selectedCol: -1,
      selectedRow: -1,
      selectedCell: {
        colId: -1,
        rowId: -1
      },
      calc: {
        sum: 0,
        avg: 0,
      }
    }
  },
  computed: {
    showCalcPanel() {
      if (this.selectedRow > -1) {
        this.calc.sum = this.calcSumByRow(this.selectedRow)
        this.calc.avg = this.calcAvgByRow(this.selectedRow)
        return true
      }
      if (this.selectedCol > -1) {
        this.calc.sum = this.calcSumByCol(this.selectedCol)
        this.calc.avg = this.calcAvgByCol(this.selectedCol)
        return true
      }
      return false
    },
  },
  methods: {
    ...mapMutations({
      setAlertUI: 'setAlertUI'
    }),
    deleteItem(table) {
      this.editedItem = Object.assign({}, table)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      await this.$store.dispatch('table/remove', this.editedItem._id);
      this.closeDelete()
      this.$router.push('/')
    },
    async newTableConfirm() {
      const data = {
        tableName: 'Новая таблица'
      }

      const response = await this.$store.dispatch('table/create', data);
      this.$router.push(`/spreadsheets/${response._id}`);
    },
    async saveTable(table) {
      const result = await this.$store.dispatch('table/save', table);
      this.lastUpdateDate = new Date()

      if (result) {
        this.$store.commit('setAlertUI', {message: 'Изменения сохранены', type: 'success'})
      }
    },
    async autoSaveTable(table) {
      const result = await this.$store.dispatch('table/save', table);

      this.autoLoadingMessage = "Данные сохранены только что"
      this.lastUpdateDate = new Date()

      this.dataAutoSaved = true
    },
    async editName(table) {
      const data = {
        id: table._id,
        tableName: table.table_name
      }

      await this.$store.dispatch('table/editName', data);
    },
    closeDelete() {
      this.dialogDelete = false
    },
    closeNewTable() {
      this.dialogNewTable = false;
    },
    updateColVal(e) {
      const colId = parseInt(e.target.dataset.colId)
      const rowId = parseInt(e.target.dataset.rowId)
      const newValue = e.target.textContent.trim()
      const colIndex = this.table.tableData.cols.findIndex((item) => item.id === colId && item.rowId === rowId)
      if (colIndex !== -1) {
        if (!newValue) {
          this.table.tableData.cols.splice(colIndex, 1);
        } else {
          if (this.table.tableData.cols[colIndex].value !== newValue) {
            this.table.tableData.cols[colIndex].value = newValue
            this.dataChanged = true
          }
        }
      } else {
        if (newValue) {
          this.table.tableData.cols.push({
            id: colId,
            rowId: rowId,
            value: newValue
          })
          this.dataChanged = true
        }
      }

    },
    onSelectCol: function (e) {
      const colId = parseInt(e.target.dataset.colId)
      this.setSelectedRowOrCol(-1, colId)
    },
    onSelectRow(e) {
      const rowId = parseInt(e.target.dataset.rowId)
      this.setSelectedRowOrCol(rowId)
      this.calcSumByRow(rowId)
    },
    onCellSelect(e) {
      const colId = parseInt(e.target.dataset.colId)
      const rowId = parseInt(e.target.dataset.rowId)
      this.setSelectedRowOrCol(-1, -1)
      this.setActiveRowAndCol(rowId, colId)
      this.selectedCell = {
        rowId: rowId,
        colId: colId
      }
    },
    onCellKeyDown(e) {
      const rowId = parseInt(e.target.dataset.rowId)
      const colId = parseInt(e.target.dataset.colId)
      let {height, width} = this.$refs.tableLayout.getBoundingClientRect()

      const codeEnter = 13;
      const codeArrowUp = 38;
      const codeArrowDown = 40;
      const codeArrowLeft = 37;
      const codeArrowRight = 39;
      // const codeTab = 9
      switch (e.keyCode) {
        case codeEnter:
        case codeArrowDown: {
          e.preventDefault()
          let nextRow = rowId + 1;
          let nextCell = document.querySelector(`[data-row-id="${nextRow}"][data-col-id="${colId}"]`)

          //predict when start scroll table
          let lastViewRow = this.fromPos + Math.ceil(height / this.rowHeight) - 10
          if (nextRow > lastViewRow) {
            let scrollRows = nextRow - lastViewRow;
            let offsetTop = this.$refs.tableLayout.scrollTop + scrollRows * this.rowHeight
            let offsetLeft = this.$refs.tableLayout.scrollLeft

            this.$refs.tableLayout.scrollTo(offsetLeft, offsetTop)
            //wait some time for redraw table and then set focus
            setTimeout(function () {
              nextCell = document.querySelector(`[data-row-id="${nextRow}"][data-col-id="${colId}"]`)
              nextCell.focus()
            }, 100)
          } else {
            nextCell.focus()
          }
          break;
        }
        case codeArrowUp: {
          e.preventDefault()
          let nextRow = rowId - 1;
          if (nextRow < 0) {
            nextRow = rowId;
          }
          let nextCell = document.querySelector(`[data-row-id="${nextRow}"][data-col-id="${colId}"]`)

          let firstViewRow = this.fromPos
          if (nextRow < firstViewRow) {
            let scrollRows = nextRow - firstViewRow;
            let offsetTop = this.$refs.tableLayout.scrollTop + scrollRows * this.rowHeight
            let offsetLeft = this.$refs.tableLayout.scrollLeft

            this.$refs.tableLayout.scrollTo(offsetLeft, offsetTop)
            //wait some time for redraw table and then set focus
            setTimeout(function () {
              nextCell = document.querySelector(`[data-row-id="${nextRow}"][data-col-id="${colId}"]`)
              nextCell.focus()
            }, 100)
          } else {
            nextCell.focus()
          }
          break;
        }
        case codeArrowLeft: {
          e.preventDefault()
          let nextCol = colId - 1;
          if (nextCol < 1) {
            nextCol = colId;
          }

          let nextCell = document.querySelector(`[data-row-id="${rowId}"][data-col-id="${nextCol}"]`)

          //predict when start scroll table
          let lastViewCol = this.fromColPos + 1
          if (nextCol < lastViewCol) {
            let scrollCols = nextCol - lastViewCol;
            let offsetTop = this.$refs.tableLayout.scrollTop
            let offsetLeft = this.$refs.tableLayout.scrollLeft + scrollCols * this.colWidth

            this.$refs.tableLayout.scrollTo(offsetLeft, offsetTop)
            //wait some time for redraw table and then set focus
            setTimeout(function () {
              nextCell = document.querySelector(`[data-row-id="${rowId}"][data-col-id="${nextCol}"]`)
              nextCell.focus()
            }, 100)
          } else {
            nextCell.focus()
          }

          break;
        }
        case codeArrowRight: {
          e.preventDefault()
          let nextCol = colId + 1;
          let nextCell = document.querySelector(`[data-row-id="${rowId}"][data-col-id="${nextCol}"]`)

          //predict when start scroll table
          let lastViewCol = this.fromColPos + Math.ceil(width / this.colWidth) - 1
          if (nextCol > lastViewCol) {
            let scrollCols = nextCol - lastViewCol;
            let offsetTop = this.$refs.tableLayout.scrollTop
            let offsetLeft = this.$refs.tableLayout.scrollLeft + scrollCols * this.colWidth

            this.$refs.tableLayout.scrollTo(offsetLeft, offsetTop)
            //wait some time for redraw table and then set focus
            setTimeout(function () {
              nextCell = document.querySelector(`[data-row-id="${rowId}"][data-col-id="${nextCol}"]`)
              nextCell.focus()
            }, 100)
          } else {
            nextCell.focus()
          }
          break;
        }
      }
    },
    setSelectedRowOrCol(rowId, colId) {
      let selRowId = parseInt(rowId) >= 0 ? parseInt(rowId) : -1
      let selColId = parseInt(colId) >= 0 ? parseInt(colId) : -1

      if (selRowId > -1) {
        selColId = -1
      }
      if (selColId > -1) {
        selRowId = -1
      }

      this.selectedRow = selRowId
      this.selectedCol = selColId
      this.setActiveRowAndCol(selRowId, selColId)
    },
    setActiveRowAndCol(rowId, colId) {
      this.activeRow = parseInt(rowId) >= 0 ? parseInt(rowId) : -1
      this.activeCol = parseInt(colId) >= 0 ? parseInt(colId) : -1
    },
    calcSumByRow(rowId) {
      let result = 0
      let tableData = 'tableData' in this.table ? this.table.tableData : {}
      let cols = 'cols' in tableData ? tableData.cols : []
      rowId = parseInt(rowId)
      if (rowId < 0) {
        return result
      }

      return cols.reduce((sum, current) => {
        let value = 0;
        if (current.rowId === rowId && parseInt(current.value)) {
          let currValue = current.value.trim()
          if (currValue.length === parseInt(currValue).toString().length) {
            value = parseInt(currValue)
          }
        }
        return sum + value
      }, 0)
    },
    calcSumByCol(colId) {
      let result = 0
      let tableData = 'tableData' in this.table ? this.table.tableData : {}
      let cols = 'cols' in tableData ? tableData.cols : []
      colId = parseInt(colId)
      if (colId < 0) {
        return result
      }

      return cols.reduce((sum, current) => {
        let value = 0;
        if (current.id === colId && parseInt(current.value)) {
          let currValue = current.value.trim()
          if (currValue.length === parseInt(currValue).toString().length) {
            value = parseInt(current.value)
          }
        }
        return sum + value
      }, 0)
    },
    calcAvgByRow(rowId) {
      let result = 0
      let tableData = 'tableData' in this.table ? this.table.tableData : {}
      let cols = 'cols' in tableData ? tableData.cols : []
      rowId = parseInt(rowId)
      if (rowId < 0) {
        return result
      }

      let elCount = 0;
      let sum = cols.reduce((sum, current) => {
        let value = 0;
        if (current.rowId === rowId && parseInt(current.value)) {
          let currValue = current.value.trim()
          if (currValue.length === parseInt(currValue).toString().length) {
            value = parseInt(current.value)
            elCount++
          }
        }

        return sum + value
      }, 0)

      if (elCount === 0) {
        return 0
      }

      let avg = sum / elCount
      if (Number.isInteger(avg)) {
        return avg
      }

      return avg.toFixed(1)
    },
    calcAvgByCol(colId) {
      let result = 0
      let tableData = 'tableData' in this.table ? this.table.tableData : {}
      let cols = 'cols' in tableData ? tableData.cols : []
      colId = parseInt(colId)
      if (colId < 0) {
        return result
      }

      let elCount = 0;
      let sum = cols.reduce((sum, current) => {
        let value = 0;
        if (current.id === colId && parseInt(current.value)) {
          let currValue = current.value.trim()
          if (currValue.length === parseInt(currValue).toString().length) {
            value = parseInt(current.value)
            elCount++
          }
        }
        if (elCount === 0) {
          return 0
        }
        return sum + value
      }, 0)

      if (elCount === 0) {
        return 0
      }

      let avg = sum / elCount
      if (Number.isInteger(avg)) {
        return avg
      }

      return avg.toFixed(1)
    },

    createHeader(fromColPos, howManyCols) {
      let that = this
      this.viewTable.headers = [...Array(howManyCols).keys()].map((idx) => {
        return {
          id: idx + fromColPos + 1,
          value: that.alphaIndex(idx + fromColPos + 1)
        }
      })
    },
    alphaIndex(num) {
      //нумерация abc..z,ab
      const base = 26
      let str = ""
      if (num === 0) return str

      do {
        const mod = num % base
        num = (num / base) | 0;
        str =
          (mod
            ? String.fromCharCode("A".charCodeAt(0) + mod - 1)
            : (--num, "Z")) + str
      } while (num)

      return str
    },
    getColValue(rowId, colId) {
      let value = "";
      let tableData = 'tableData' in this.table ? this.table.tableData : {}
      let cols = 'cols' in tableData ? tableData.cols : []
      const col = cols.find(
        item => item.id === colId && item.rowId === rowId && !!item.value
      )
      if (!!col) {
        value = col.value
      }

      return value
    },
    generateRow(position, fromColPos, finalCol) {
      const countCols = finalCol - fromColPos;
      const cols = [...Array(countCols).keys()].map((item) => {
        return {
          id: fromColPos + item + 1,
          value: this.getColValue(position, fromColPos + item + 1)
        }
      });

      return {
        id: position,
        cols: cols
      };
    },
    renderChunk(fromPos, howMany, fromColPos, howManyCols) {
      // Увеличиваем количество строк
      if (this.totalRows - fromPos < howMany * 2) {
        this.totalRows += howMany * 4;
      }

      // Увеличиваем количество колонок
      if (this.totalCols - fromColPos < howManyCols * 2) {
        this.totalCols += howManyCols * 4;
      }

      this.$refs.table.style.marginTop = fromPos * this.rowHeight + 'px'
      this.$refs.table.style.marginLeft = fromColPos * this.colWidth + 'px'
      this.createHeader(fromColPos, howManyCols)

      this.fromPos = fromPos
      this.howMany = howMany
      this.fromColPos = fromColPos
      this.howManyCols = howManyCols
      this.totalHeight = this.rowHeight * this.totalRows
      this.totalWidth = this.colWidth * this.totalCols
      let finalRow = fromPos + howMany;
      if (finalRow > this.totalRows) finalRow = this.totalRows;
      let finalCol = fromColPos + howManyCols;
      if (finalCol > this.totalCols) finalCol = this.totalCols;
      let viewRows = [];
      for (let i = fromPos; i < finalRow; i++) {
        viewRows.push(this.generateRow(i, fromColPos, finalCol))
      }

      this.viewTable.rows = viewRows
      this.tableWidth = this.tableWidth || howManyCols * this.colWidth
    },

    initTableData() {
      if (!('tableData' in this.table)) {
        this.table.tableData = {}
      }
      if (!('cols' in this.table.tableData)) {
        this.table.tableData.cols = []
      }

      let lastUpdate = 'update_at' in this.table ? new Date(this.table.update_at) : new Date()
      this.lastUpdateDate = lastUpdate;
    },
    drawTable() {
      let {height, width} = this.$refs.tableLayout.getBoundingClientRect()

      let screenItemsLen = Math.ceil(height / this.rowHeight)
      let screenColsLen = Math.ceil(width / this.colWidth)
      // Cache 4 times the number of items that fit in the container viewport
      this.cachedItemsLen = screenItemsLen * 2
      this.cachedColsLen = screenColsLen * 2
      this.renderChunk(0, this.cachedItemsLen, 0, this.cachedColsLen)

      this.maxBuffer = screenItemsLen * this.rowHeight
      this.maxBufferCols = screenColsLen * this.colWidth
    },
    addScrollListener() {
      window.scroller = this
      let lastRepaintY, lastRepaintX;
      let maxBuffer = this.maxBuffer
      let maxBufferCols = this.maxBufferCols
      let cachedItemsLen = this.cachedItemsLen
      let cachedColsLen = this.cachedColsLen

      this.$refs.tableLayout.addEventListener('scroll', (ev) => {
        let needRepaint = false;
        //Скролл по вертикали
        let scrollTop = ev.target.scrollTop
        let firstRow = (scrollTop - this.offsetHeight) / this.rowHeight
        firstRow = firstRow < 0 ? 0 : firstRow
        if (!lastRepaintY || Math.abs(scrollTop - lastRepaintY) > maxBuffer || scrollTop < lastRepaintY) {
          needRepaint = true
          lastRepaintY = scrollTop
        }
        //Скролл по горизонтали
        let scrollLeft = ev.target.scrollLeft
        let firstCol = (scrollLeft - this.offsetWidth) / this.colWidth
        firstCol = firstCol < 0 ? 0 : firstCol
        if (!lastRepaintX || Math.abs(scrollLeft - lastRepaintX) > maxBufferCols || scrollLeft < lastRepaintX) {
          needRepaint = true
          lastRepaintX = scrollLeft;
        }

        if (needRepaint) {
          this.renderChunk(Math.floor(firstRow), cachedItemsLen, Math.floor(firstCol), cachedColsLen)
        }

      }, {passive: true})
    },

    initAutoSave() {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
      let date = this.lastUpdateDate.toLocaleDateString('ru-RU', options)
      this.autoLoadingMessage = `Данные сохранены ${date}`
      if (!this.dataAutoSaved) {
        this.autoSaveTable(this.table)
      }

      let that = this
      setTimeout(function () {
        that.initAutoSave()
      }, 2000);
    }
  },

  mounted() {
    this.initTableData()
    this.drawTable()
    this.addScrollListener()
    this.initAutoSave()
  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete()
    },
    dataChanged(val) {
      if (val && this.dataAutoSaved) {
        this.dataAutoSaved = false
      }
      this.dataChanged = false;
    }
  }
}
</script>

<style scoped lang='scss'>

$border: #C0C0C0;
$borderLight: #E2E3E3;
$borderBlue: #2376E5;
$bgCol: #E8EAED;
$bgDark: #5F6368;
$bgBlue: #E8F0FD;

.doc-template {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.doc-header {
  display: flex;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 130px;

  &__messages {
    margin-top: 20px;
    font: 13px 'Arial', sans-serif;
    color: #fff;

    .v-icon {
      margin-right: 10px;
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 70px;
    height: 70px;

    img {
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }

  &__info {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: calc(100% - 70px);
    padding: 15px 20px 15px 15px;
  }

  &__input {
    width: 50%;
  }
}

//table styles
.table-layout {
  overflow: auto;
  width: 100%;
  height: 100%;
  padding-top: 130px;
  padding-bottom: 50px;
}

.table {
  display: table;
  position: relative;
  width: 100%;
  overflow: auto;

  &__header {
    display: table-row;
    white-space: nowrap;
  }

  &__tr {
    display: table-row;
  }

  &__th,
  &__td {
    display: table-cell;
    white-space: nowrap;
    min-width: 150px;
    max-width: 150px;
    height: 25px;
    font: 14px 'Arial', sans-serif;
    line-height: 1;
    vertical-align: middle;
    border-right: 1px solid $border;
    border-bottom: 1px solid $border;
  }

  &__th {
    background-color: $bgCol;
    text-align: center;
    position: sticky;
    z-index: 1;
    top: 0;
    transition: background-color .3s linear, color .3s linear;

    &.is-hover-col {
      background-color: $bgDark;
      color: #fff;
    }
  }

  &__td {
    background-color: #fff;
    border-color: $borderLight;
    padding: 0 5px;
    overflow: hidden;
    transition: background-color .3s linear, border-color .3s linear;

    &_number {
      text-align: center;
      position: sticky;
      left: 0;
      padding: 0;
      border-color: $border;
    }

    &.is-hover {
      background-color: $bgBlue;
      outline: 2px solid $borderBlue;
    }

    &.is-hover-col {
      border-left: 1px solid $borderBlue;
      border-right: 1px solid $borderBlue;
      background-color: $bgBlue;
    }

    &.is-hover-row:not(.table__td_number) {
      border-top: 1px solid $borderBlue;
      border-bottom: 1px solid $borderBlue;
      background-color: $bgBlue;
    }

    &_number.is-hover-row {
      background-color: $bgDark;
      color: #fff;
    }
  }

  &__th_space,
  &__td_number {
    background-color: $bgCol;
    min-width: 50px;
    max-width: 50px;
  }
}


.panel-footer {
  display: block;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid rgba($border, .7);

  &__content {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 10px 50px;
  }
}

.function-box {
  font-size: 14px;
  margin-left: 40px;

  &__title {
    display: inline-block;
    color: #000;
    font-size: 13px;
    font-weight: bold;
  }
}
</style>

<style lang="scss">
.doc-header {
  .theme--dark.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
    color: rgba(255, 255, 255, 0)
  }

  .theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
    border-color: transparent;
  }

  &__input {
    .v-input {
      max-width: 500px;
    }
  }
}
</style>
