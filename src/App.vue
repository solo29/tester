<template>
  <v-app>
    <div class="body">
      <v-autocomplete
        dark
        v-model="selected"
        :items="subjects"
        flat
        item-value="id"
        item-text="name"
        hide-no-data
        hide-details
        label="Select it"
        solo-inverted
      ></v-autocomplete>
      <v-card dark v-if="current" class="pa-2">
        <p v-html="current.q"></p>

        <p></p>
        <v-radio-group v-model="radioGroup">
          <v-radio
            :disabled="radioGroup>0 && radioGroup !=a"
            :color="radioGroup==1 ? 'green':'red' "
            :style="radioGroup == 1 && a==1? 'background: green;' : 
              radioGroup && a==1 ? 'background: green;' : ''"
            v-for="a in shuffledAnswers"
            :key="a"
            :value="a"
          >
            <template slot="label">
              <span v-html="current['a'+a] "></span>
            </template>
          </v-radio>
        </v-radio-group>
        <v-btn class="mb-4" @click="next" style="float: right" :disabled="!radioGroup">შემდეგი</v-btn>
        <v-progress-linear :value="((trueCount+falseCount)/this.test.length)*100"></v-progress-linear>
        <p class="pa-2 ma-2">
          გაცემული: {{trueCount+falseCount}}
          <span style="float: right">სულ: {{this.test.length}}</span>
        </p>
        <p>სწორი: {{trueCount}}</p>
        <p>არასწორი: {{falseCount}}</p>
      </v-card>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    current: null,
    shuffledAnswers: [1, 2, 3, 4],
    trueCount: 0,
    falseCount: 0,
    radioGroup: null,
    test: [],
    tests: [],
    selected: null,
    subjects: []
  }),
  watch: {
    selected(id) {
      this.start(id);
    }
  },
  mounted() {
    fetch("/subjects.json")
      .then(r => r.json())
      .then(x => {
        console.log(x);
        this.subjects = x;
      });
    fetch("/tests.json")
      .then(r => r.json())
      .then(x => {
        console.log(x);
        this.tests = x;
      });
  },
  methods: {
    next() {
      this.shuffledAnswers = this.shuffle(this.shuffledAnswers);
      if (this.radioGroup) {
        if (this.radioGroup == 1) {
          this.trueCount++;
        } else {
          this.test.unshift(this.current);
          this.falseCount++;
        }
      }
      this.radioGroup = null;

      if (this.test.length <= 0) {
        alert("გათავდა :)");
        this.start(this.selected);
      }
      this.current = this.test.pop();
    },
    shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    },
    start(id) {
      let test = this.tests.filter(x => x.sb == id);

      this.test = this.shuffle(test);
      this.radioGroup = null;
      this.falseCount = 0;
      this.trueCount = 0;
      if (this.test.length) this.next();
      else alert("არ მოიძებნა ტესტები :(");
    }
  }
};
</script>
<style lang="scss">
.v-toolbar {
  height: 100px;
}
.body {
  background: black;
  color: white;
  height: 100%;
  width: 100%;
}
.v-radio {
  border-radius: 10px;
}
</style>