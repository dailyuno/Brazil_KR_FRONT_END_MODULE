Vue.component('view-mode', {
    template: `
        <section class="mode view-mode">
            <transition name="fade">
                <div class="view-container" role="presentation" aria-label="view presentation" v-if="currentPage !== 'final'">
                    <div class="question">
                        <div class="question-statistics">
                            <div class="question-count correct">
                                <span>Correct Questions</span> <span>{{ questions.correct.size }}</span>
                            </div>
                            <div class="question-count find">
                                <span>Found Questions</span> <span>{{ questions.found.size }}</span>
                            </div>
                            <div class="question-count total">
                                <span>Total Questions</span> <span>{{ elements.length - 1 }}</span>
                            </div>
                        </div>
                    
                        <div class="question-content" v-html="page.html"></div>
                    </div>
                    <ul class="answers">
                        <template v-for="answer in answers">
                            <li @click="next(answer)">{{ answer.caption }}</li>
                        </template>
                    </ul>
                </div>
                
                <div class="result-container" v-else>
                    <div class="result">
                        <h1 class="text-center pb-5">Result</h1>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="result-item correct">
                                    <div class="result-value">
                                        {{ questions.correct.size }}
                                    </div>
                                    <div class="result-key">
                                        Correct Answer
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="result-item wrong">
                                    <div class="result-value">
                                        {{ questions.wrong }}
                                    </div>
                                    <div class="result-key">
                                        Wrong Answer
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="result-item secret">
                                    <div class="result-value">
                                        {{ elements.length - 1 - questions.found.size }}
                                    </div>
                                    <div class="result-key">
                                        Secret Answer
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="result-item total">
                                    <div class="result-value">
                                        {{ elements.length - 1 }}
                                    </div>
                                    <div class="result-key">
                                        Total Answer
                                    </div>
                                </div>
                            </div>
                        </div>
                           
                        <div class="text-right pt-5">
                            <button class="btn btn-danger restart-btn" @click="restart">Restart</button>
                        </div>
                    </div>
                </div>
            </transition>
            
            <transition name="fade">
                <div class="effect" aria-hidden="true" role="alert" :data-type="effect.type" v-if="effect">{{ effect.type }} answer</div>
            </transition>
        </section>
    `,
    props: {
        elements: Array,
        links: Array
    },
    data() {
        return {
            currentPage: 'begin',
            questions: {
                correct: new Set(),
                wrong: 0,
                found: new Set(['begin'])
            },
            effect: null
        }
    },
    methods: {
        next(answer) {
            this.effect = answer;

            const { type, origin, target } = answer;

            setTimeout(_ => {
                this.questions.found.add(target.id);

                if (type === 'correct') {
                    this.questions.correct.add(origin.id);
                } else {
                    this.questions.wrong += 1;
                }

                this.effect = null;
                this.currentPage = target.id;
            }, 1000);
        },
        restart() {
            this.currentPage = 'begin';
            this.questions = {
                correct: new Set(),
                wrong: 0,
                found: new Set(['begin'])
            };
        }
    },
    computed: {
        page() {
            return this.elements.find(x => x.id === this.currentPage);
        },
        answers() {
            return this.links.filter(x => {
                return x.origin.id === this.page.id;
            });
        }
    },
    created() {
        console.log(this.answers, this.page.id);
    }
});