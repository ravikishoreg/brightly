import { insertHeader } from './header.js';
import { generateCommonConfigHTML, generateQuestionKey, getAvailableQuestions } from './common.js';

// Example Grammar Quiz functionality
console.log('Grammar Quiz page loaded');

// Grammar Question Generator
class GrammarQuestionGenerator {
  constructor() {
    // No configuration needed
  }

  generateQuestions(count, usedQuestions = new Set()) {
    const questions = [];

    for (let i = 0; i < count; i++) {
      const question = this.generateGrammarQuestion(usedQuestions);
      questions.push(question);
      usedQuestions.add(generateQuestionKey(question));
    }

    return questions;
  }

  generateGrammarQuestion(usedQuestions = new Set()) {
    const questions = [
      // Verb Tenses - Present Simple
      { question: "Choose the correct form: 'She _____ to the store every day.'", options: ['go', 'goes', 'going', 'went'], correctAnswer: 'goes', explanation: 'Third person singular present simple uses -s ending' },
      { question: "Fill in: 'The sun _____ in the east every morning.'", options: ['rise', 'rises', 'rising', 'rose'], correctAnswer: 'rises', explanation: 'General truth uses present simple with -s for third person' },
      { question: "Which is correct: 'My sister _____ in Paris.'", options: ['live', 'lives', 'living', 'lived'], correctAnswer: 'lives', explanation: 'Third person singular present simple' },
      { question: "Complete: 'The train _____ at 3 PM daily.'", options: ['arrive', 'arrives', 'arriving', 'arrived'], correctAnswer: 'arrives', explanation: 'Scheduled events use present simple' },
      { question: "Choose: 'He _____ breakfast at 8 AM.'", options: ['have', 'has', 'having', 'had'], correctAnswer: 'has', explanation: 'Third person singular of "have" is "has"' },
      { question: "Fill in: 'The Earth _____ around the sun.'", options: ['orbit', 'orbits', 'orbiting', 'orbited'], correctAnswer: 'orbits', explanation: 'Scientific facts use present simple', },
      { question: "Which is correct: 'Water _____ at 100 degrees Celsius.'", options: ['boil', 'boils', 'boiling', 'boiled'], correctAnswer: 'boils', explanation: 'General truths use present simple', },
      { question: "Complete: 'She _____ English very well.'", options: ['speak', 'speaks', 'speaking', 'spoke'], correctAnswer: 'speaks', explanation: 'Third person singular present simple', },
      { question: "Choose: 'The library _____ at 9 AM.'", options: ['open', 'opens', 'opening', 'opened'], correctAnswer: 'opens', explanation: 'Scheduled events use present simple', },
      { question: "Fill in: 'He _____ to music every day.'", options: ['listen', 'listens', 'listening', 'listened'], correctAnswer: 'listens', explanation: 'Third person singular present simple', },
      { question: "Complete: 'They _____ English at school.'", options: ['study', 'studies', 'studying', 'studied'], correctAnswer: 'study', explanation: 'Plural subjects use base form in present simple', },
      { question: "Which is correct: 'He _____ breakfast at 8 AM.'", options: ['have', 'has', 'having', 'had'], correctAnswer: 'has', explanation: 'Third person singular of "have" is "has"', },
      { question: "Fill in: 'The sun _____ in the east.'", options: ['rise', 'rises', 'rising', 'rose'], correctAnswer: 'rises', explanation: 'General truth uses present simple with -s for third person', },
      { question: "Choose: 'My brother _____ in London.'", options: ['live', 'lives', 'living', 'lived'], correctAnswer: 'lives', explanation: 'Third person singular present simple', },

      // Verb Tenses - Present Continuous
      { question: "Complete: 'I _____ dinner right now.'", options: ['cook', 'cooks', 'am cooking', 'cooked'], correctAnswer: 'am cooking', explanation: 'Present continuous for actions happening now', },
      { question: "Which is correct: 'They _____ TV at the moment.'", options: ['watch', 'watches', 'are watching', 'watched'], correctAnswer: 'are watching', explanation: 'Present continuous for current actions', },
      { question: "Fill in: 'She _____ her homework now.'", options: ['do', 'does', 'is doing', 'did'], correctAnswer: 'is doing', explanation: 'Present continuous with third person singular', },
      { question: "Choose: 'We _____ for the bus.'", options: ['wait', 'waits', 'are waiting', 'waited'], correctAnswer: 'are waiting', explanation: 'Present continuous for ongoing action', },
      { question: "Complete: 'The children _____ in the garden.'", options: ['play', 'plays', 'are playing', 'played'], correctAnswer: 'are playing', explanation: 'Present continuous for current activity', },

      // Verb Tenses - Past Simple
      { question: "Choose the correct form: 'She _____ to the store yesterday.'", options: ['go', 'goes', 'went', 'going'], correctAnswer: 'went', explanation: 'Past tense of "go" is "went"', },
      { question: "Complete: 'They _____ dinner at 7 PM.'", options: ['eat', 'eats', 'ate', 'eating'], correctAnswer: 'ate', explanation: 'Past tense of "eat" is "ate"', },
      { question: "Which is correct: 'He _____ the movie last night.'", options: ['watch', 'watches', 'watched', 'watching'], correctAnswer: 'watched', explanation: 'Regular past tense with -ed ending', },
      { question: "Fill in: 'We _____ to Paris last summer.'", options: ['travel', 'travels', 'traveled', 'traveling'], correctAnswer: 'traveled', explanation: 'Regular past tense for "travel"', },
      { question: "Choose: 'The train _____ at 3 PM.'", options: ['arrive', 'arrives', 'arrived', 'arriving'], correctAnswer: 'arrived', explanation: 'Past tense of "arrive"', },

      // Verb Tenses - Past Continuous
      { question: "Complete: 'I _____ when the phone rang.'", options: ['sleep', 'slept', 'was sleeping', 'am sleeping'], correctAnswer: 'was sleeping', explanation: 'Past continuous for interrupted action', },
      { question: "Which is correct: 'They _____ dinner when I called.'", options: ['have', 'had', 'were having', 'are having'], correctAnswer: 'were having', explanation: 'Past continuous for ongoing past action', },
      { question: "Fill in: 'She _____ a book at 8 PM.'", options: ['read', 'reads', 'was reading', 'is reading'], correctAnswer: 'was reading', explanation: 'Past continuous for specific past time', },
      { question: "Choose: 'We _____ TV when the power went out.'", options: ['watch', 'watched', 'were watching', 'are watching'], correctAnswer: 'were watching', explanation: 'Past continuous for interrupted action', },
      { question: "Complete: 'The children _____ in the park.'", options: ['play', 'played', 'were playing', 'are playing'], correctAnswer: 'were playing', explanation: 'Past continuous for ongoing past activity', },

      // Verb Tenses - Present Perfect
      { question: "Complete: 'I _____ to Paris three times.'", options: ['go', 'went', 'have been', 'am going'], correctAnswer: 'have been', explanation: 'Present perfect for experiences', },
      { question: "Which is correct: 'She _____ her homework.'", options: ['finish', 'finished', 'has finished', 'is finishing'], correctAnswer: 'has finished', explanation: 'Present perfect for completed action with present relevance', },
      { question: "Fill in: 'They _____ each other for ten years.'", options: ['know', 'knew', 'have known', 'are knowing'], correctAnswer: 'have known', explanation: 'Present perfect for duration up to now', },
      { question: "Choose: 'We _____ this movie before.'", options: ['see', 'saw', 'have seen', 'are seeing'], correctAnswer: 'have seen', explanation: 'Present perfect for past experience', },
      { question: "Complete: 'He _____ in London since 2010.'", options: ['live', 'lived', 'has lived', 'is living'], correctAnswer: 'has lived', explanation: 'Present perfect for duration', },

      // Verb Tenses - Future
      { question: "Complete: 'I _____ to the party tomorrow.'", options: ['go', 'went', 'will go', 'am going'], correctAnswer: 'will go', explanation: 'Future with "will" for predictions/decisions', },
      { question: "Which is correct: 'She _____ dinner at 7 PM.'", options: ['cook', 'cooked', 'will cook', 'is cooking'], correctAnswer: 'will cook', explanation: 'Future action with "will"', },
      { question: "Fill in: 'We _____ the project by Friday.'", options: ['finish', 'finished', 'will finish', 'are finishing'], correctAnswer: 'will finish', explanation: 'Future completion with "will"', },
      { question: "Choose: 'They _____ the meeting next week.'", options: ['attend', 'attended', 'will attend', 'are attending'], correctAnswer: 'will attend', explanation: 'Future event with "will"', },
      { question: "Complete: 'The train _____ at 3 PM.'", options: ['leave', 'left', 'will leave', 'is leaving'], correctAnswer: 'will leave', explanation: 'Future scheduled event', },

      // Parts of Speech - Nouns
      { question: "Which word is a noun in: 'The quick brown fox jumps over the lazy dog.'?", options: ['quick', 'fox', 'jumps', 'lazy'], correctAnswer: 'fox', explanation: 'Fox is a noun (animal)', },
      { question: "Identify the abstract noun: 'Love conquers all.'", options: ['Love', 'conquers', 'all', 'none'], correctAnswer: 'Love', explanation: 'Love is an abstract noun (emotion)', },
      { question: "Which is a collective noun?", options: ['team', 'player', 'game', 'ball'], correctAnswer: 'team', explanation: 'Team is a collective noun (group of people)', },
      { question: "Find the proper noun: 'I visited London last summer.'", options: ['visited', 'London', 'last', 'summer'], correctAnswer: 'London', explanation: 'London is a proper noun (specific place)', },
      { question: "Which word is a concrete noun?", options: ['happiness', 'table', 'freedom', 'justice'], correctAnswer: 'table', explanation: 'Table is a concrete noun (can be touched)', },
      { question: "Identify the compound noun: 'The firefighter saved the child.'", options: ['firefighter', 'saved', 'child', 'the'], correctAnswer: 'firefighter', explanation: 'Firefighter is a compound noun (fire + fighter)', },
      { question: "Which is a mass noun?", options: ['water', 'book', 'car', 'tree'], correctAnswer: 'water', explanation: 'Water is a mass noun (uncountable)', },
      { question: "Find the countable noun: 'I need some advice.'", options: ['I', 'need', 'some', 'advice'], correctAnswer: 'advice', explanation: 'Advice is a countable noun in this context', },
      { question: "Which word is a gerund (noun form)?", options: ['running', 'run', 'runs', 'ran'], correctAnswer: 'running', explanation: 'Running is a gerund (verb + ing used as noun)', },
      { question: "Identify the possessive noun: 'The dog\'s tail is wagging.'", options: ['dog\'s', 'tail', 'is', 'wagging'], correctAnswer: 'dog\'s', explanation: 'Dog\'s shows possession', },
      { question: "Identify the noun: 'Happiness is a state of mind.'", options: ['Happiness', 'is', 'state', 'mind'], correctAnswer: 'Happiness', explanation: 'Happiness is an abstract noun', },
      { question: "Which is a proper noun?", options: ['city', 'London', 'country', 'river'], correctAnswer: 'London', explanation: 'London is a proper noun (specific place name)', },
      { question: "Find the collective noun: 'The flock of birds flew south.'", options: ['flock', 'birds', 'flew', 'south'], correctAnswer: 'flock', explanation: 'Flock is a collective noun for birds', },
      { question: "Which word is a concrete noun?", options: ['love', 'table', 'freedom', 'justice'], correctAnswer: 'table', explanation: 'Table is a concrete noun (can be touched)', },

      // Parts of Speech - Verbs
      { question: "Identify the verb: 'The cat sleeps peacefully.'", options: ['cat', 'sleeps', 'peacefully', 'the'], correctAnswer: 'sleeps', explanation: 'Sleeps is the action verb', },
      { question: "Which is a linking verb?", options: ['run', 'jump', 'is', 'eat'], correctAnswer: 'is', explanation: 'Is is a linking verb (be verb)', },
      { question: "Find the helping verb: 'She has finished her work.'", options: ['She', 'has', 'finished', 'work'], correctAnswer: 'has', explanation: 'Has is a helping verb', },
      { question: "Which is an irregular verb?", options: ['walk', 'talk', 'go', 'play'], correctAnswer: 'go', explanation: 'Go is irregular (go, went, gone)', },
      { question: "Identify the transitive verb: 'She reads books.'", options: ['She', 'reads', 'books', 'all'], correctAnswer: 'reads', explanation: 'Reads takes a direct object (books)', },

      // Parts of Speech - Adjectives
      { question: "Identify the adjective: 'The red car is fast.'", options: ['The', 'red', 'car', 'fast'], correctAnswer: 'red', explanation: 'Red describes the car', },
      { question: "Which is a comparative adjective?", options: ['big', 'bigger', 'biggest', 'large'], correctAnswer: 'bigger', explanation: 'Bigger is the comparative form', },
      { question: "Find the superlative adjective: 'This is the best movie.'", options: ['This', 'is', 'the', 'best'], correctAnswer: 'best', explanation: 'Best is the superlative form of good', },
      { question: "Which is a descriptive adjective?", options: ['this', 'that', 'beautiful', 'some'], correctAnswer: 'beautiful', explanation: 'Beautiful describes quality', },
      { question: "Identify the possessive adjective: 'My book is here.'", options: ['My', 'book', 'is', 'here'], correctAnswer: 'My', explanation: 'My shows possession', },

      // Parts of Speech - Adverbs
      { question: "Identify the adverb: 'She runs quickly.'", options: ['She', 'runs', 'quickly', 'all'], correctAnswer: 'quickly', explanation: 'Quickly modifies the verb runs', },
      { question: "Which adverb shows frequency?", options: ['very', 'often', 'here', 'now'], correctAnswer: 'often', explanation: 'Often shows how frequently something happens', },
      { question: "Find the adverb of manner: 'He spoke softly.'", options: ['He', 'spoke', 'softly', 'all'], correctAnswer: 'softly', explanation: 'Softly describes how he spoke', },
      { question: "Which is an adverb of place?", options: ['today', 'there', 'very', 'quickly'], correctAnswer: 'there', explanation: 'There indicates location', },
      { question: "Identify the adverb of time: 'I will see you tomorrow.'", options: ['I', 'will', 'see', 'tomorrow'], correctAnswer: 'tomorrow', explanation: 'Tomorrow indicates when', },

      // Parts of Speech - Pronouns
      { question: "Identify the personal pronoun: 'She went to the store.'", options: ['She', 'went', 'to', 'store'], correctAnswer: 'She', explanation: 'She is a personal pronoun', },
      { question: "Which is a possessive pronoun?", options: ['my', 'mine', 'me', 'I'], correctAnswer: 'mine', explanation: 'Mine shows possession', },
      { question: "Find the reflexive pronoun: 'He hurt himself.'", options: ['He', 'hurt', 'himself', 'all'], correctAnswer: 'himself', explanation: 'Himself refers back to the subject', },
      { question: "Which is a demonstrative pronoun?", options: ['this', 'who', 'what', 'which'], correctAnswer: 'this', explanation: 'This points to something specific', },
      { question: "Identify the relative pronoun: 'The book that I read was good.'", options: ['The', 'book', 'that', 'read'], correctAnswer: 'that', explanation: 'That introduces the relative clause', },

      // Articles and Determiners
      { question: "Choose the correct article: 'I saw _____ elephant.'", options: ['a', 'an', 'the', 'no article'], correctAnswer: 'an', explanation: 'Use "an" before words starting with vowel sounds', },
      { question: "Which article is correct: '_____ sun is bright.'", options: ['A', 'An', 'The', 'No article'], correctAnswer: 'The', explanation: 'Use "the" for unique objects', },
      { question: "Fill in: 'She has _____ apple.'", options: ['a', 'an', 'the', 'no article'], correctAnswer: 'an', explanation: 'Apple starts with a vowel sound', },
      { question: "Choose: '_____ United States is a country.'", options: ['A', 'An', 'The', 'No article'], correctAnswer: 'The', explanation: 'Use "the" with country names that are plural or contain "of"', },
      { question: "Which is correct: 'I need _____ water.'", options: ['a', 'an', 'the', 'no article'], correctAnswer: 'no article', explanation: 'Uncountable nouns don\'t need articles', },

      // Prepositions
      { question: "Choose the correct preposition: 'The book is _____ the table.'", options: ['in', 'on', 'at', 'by'], correctAnswer: 'on', explanation: 'On indicates surface contact', },
      { question: "Fill in: 'She lives _____ London.'", options: ['in', 'on', 'at', 'by'], correctAnswer: 'in', explanation: 'In is used for cities', },
      { question: "Which preposition is correct: 'I will meet you _____ 3 PM.'", options: ['in', 'on', 'at', 'by'], correctAnswer: 'at', explanation: 'At is used for specific times', },
      { question: "Choose: 'The cat is _____ the box.'", options: ['in', 'on', 'at', 'by'], correctAnswer: 'in', explanation: 'In indicates inside a container', },
      { question: "Fill in: 'He arrived _____ Monday.'", options: ['in', 'on', 'at', 'by'], correctAnswer: 'on', explanation: 'On is used for days', },

      // Conjunctions
      { question: "Choose the correct conjunction: 'I like tea _____ coffee.'", options: ['and', 'but', 'or', 'so'], correctAnswer: 'and', explanation: 'And connects similar ideas', },
      { question: "Fill in: 'She is tired _____ she worked hard.'", options: ['and', 'but', 'or', 'because'], correctAnswer: 'because', explanation: 'Because shows cause and effect', },
      { question: "Which conjunction is correct: 'I will go _____ it rains.'", options: ['and', 'but', 'or', 'unless'], correctAnswer: 'unless', explanation: 'Unless means "if not"', },
      { question: "Choose: 'He is tall _____ his brother is short.'", options: ['and', 'but', 'or', 'so'], correctAnswer: 'but', explanation: 'But shows contrast', },
      { question: "Fill in: 'You can have tea _____ coffee.'", options: ['and', 'but', 'or', 'so'], correctAnswer: 'or', explanation: 'Or shows choice between options', },

      // Subject-Verb Agreement
      { question: "Choose the correct verb: 'The cat _____ on the sofa.'", options: ['sleep', 'sleeps', 'sleeping', 'slept'], correctAnswer: 'sleeps', explanation: 'Singular subject (cat) takes singular verb', },
      { question: "Fill in: 'The students _____ their homework.'", options: ['complete', 'completes', 'completing', 'completed'], correctAnswer: 'complete', explanation: 'Plural subject (students) takes plural verb', },
      { question: "Which is correct: 'Each of the boys _____ a book.'", options: ['have', 'has', 'having', 'had'], correctAnswer: 'has', explanation: 'Each takes singular verb', },
      { question: "Choose: 'Neither the teacher nor the students _____ ready.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'are', explanation: 'With "neither...nor", verb agrees with nearest subject', },
      { question: "Fill in: 'The committee _____ meeting today.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'is', explanation: 'Collective nouns can take singular verbs', },
      { question: "Which is correct: 'All of the money _____ gone.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'is', explanation: 'Money is uncountable, takes singular verb', },
      { question: "Choose: 'Some of the students _____ late.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'are', explanation: 'Students is plural, takes plural verb', },
      { question: "Fill in: 'The news _____ good.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'is', explanation: 'News is uncountable, takes singular verb', },
      { question: "Which is correct: 'Mathematics _____ my favorite subject.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'is', explanation: 'Mathematics is uncountable, takes singular verb', },
      { question: "Choose: 'The police _____ investigating the case.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'are', explanation: 'Police is plural, takes plural verb', },
      { question: "Fill in: 'The dogs _____ in the park.'", options: ['run', 'runs', 'running', 'ran'], correctAnswer: 'run', explanation: 'Plural subject (dogs) takes plural verb', },
      { question: "Which is correct: 'Either John or Mary _____ coming.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'is', explanation: 'With "either...or", verb agrees with nearest subject', },
      { question: "Choose: 'The team _____ playing well.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'is', explanation: 'Collective nouns can take singular verbs', },
      { question: "Fill in: 'Neither the teacher nor the students _____ ready.'", options: ['is', 'are', 'be', 'being'], correctAnswer: 'are', explanation: 'With "neither...nor", verb agrees with nearest subject', },

      // Sentence Structure
      { question: "Which sentence is grammatically correct?", options: ['Me and him went to the store.', 'He and I went to the store.', 'Him and me went to the store.', 'I and he went to the store.',], correctAnswer: 'He and I went to the store.', explanation: 'Use subject pronouns (he, I) not object pronouns (him, me)', },
      { question: "Choose the correct sentence:", options: ['Between you and I, this is wrong.', 'Between you and me, this is wrong.', 'Between you and myself, this is wrong.', 'Between you and mine, this is wrong.',], correctAnswer: 'Between you and me, this is wrong.', explanation: 'Use object pronouns after prepositions', },
      { question: "Which sentence has correct word order?", options: ['I yesterday went to the store.', 'I went yesterday to the store.', 'I went to the store yesterday.', 'Yesterday I went to the store.',], correctAnswer: 'I went to the store yesterday.', explanation: 'Time expressions usually go at the end', },
      { question: "Choose the correct structure:", options: ['She is more taller than me.', 'She is taller than me.', 'She is more tall than me.', 'She is tall than me.',], correctAnswer: 'She is taller than me.', explanation: 'Use comparative form, not "more" with -er', },
      { question: "Which sentence is correct?", options: ['I have been to Paris last year.', 'I went to Paris last year.', 'I have gone to Paris last year.', 'I am going to Paris last year.',], correctAnswer: 'I went to Paris last year.', explanation: 'Use past simple with specific past time', },

      // Plurals and Irregular Forms
      { question: "What is the plural form of 'child'?", options: ['childs', 'children', 'childes', 'child'], correctAnswer: 'children', explanation: 'Child becomes children (irregular plural)', },
      { question: "Choose the correct plural: 'The _____ are flying.'", options: ['goose', 'gooses', 'geese', 'goosies'], correctAnswer: 'geese', explanation: 'Goose becomes geese (irregular plural)', },
      { question: "What is the plural of 'man'?", options: ['mans', 'men', 'manes', 'man'], correctAnswer: 'men', explanation: 'Man becomes men (irregular plural)', },
      { question: "Choose the correct plural: 'The _____ are in the field.'", options: ['sheep', 'sheeps', 'sheepes', 'sheepies'], correctAnswer: 'sheep', explanation: 'Sheep is the same in singular and plural', },
      { question: "What is the plural of 'woman'?", options: ['womans', 'women', 'womanes', 'woman'], correctAnswer: 'women', explanation: 'Woman becomes women (irregular plural)', },

      // Conditionals
      { question: "Complete the sentence: 'If it rains tomorrow, I _____ stay home.'", options: ['will', 'would', 'am', 'have'], correctAnswer: 'will', explanation: 'First conditional uses "will" for the result', },
      { question: "Fill in: 'If I _____ rich, I would buy a house.'", options: ['am', 'was', 'were', 'will be'], correctAnswer: 'were', explanation: 'Second conditional uses "were" for all persons', },
      { question: "Choose: 'If I had studied harder, I _____ passed the exam.'", options: ['will', 'would', 'would have', 'had'], correctAnswer: 'would have', explanation: 'Third conditional uses "would have" + past participle', },
      { question: "Complete: 'Unless you _____ soon, you\'ll miss the train.'", options: ['leave', 'leaves', 'left', 'leaving'], correctAnswer: 'leave', explanation: 'Unless means "if not" - use present simple', },
      { question: "Fill in: 'If I _____ you, I would accept the job.'", options: ['am', 'was', 'were', 'will be'], correctAnswer: 'were', explanation: 'Second conditional with "if I were you"', },
      { question: "Which is correct: 'If it _____ tomorrow, we\'ll cancel the picnic.'", options: ['rain', 'rains', 'rained', 'raining'], correctAnswer: 'rains', explanation: 'First conditional uses present simple in if clause', },
      { question: "Choose: 'If I _____ the lottery, I would travel the world.'", options: ['win', 'wins', 'won', 'winning'], correctAnswer: 'won', explanation: 'Second conditional uses past simple in if clause', },
      { question: "Fill in: 'If she _____ the truth, she would have told us.'", options: ['know', 'knew', 'had known', 'knows'], correctAnswer: 'had known', explanation: 'Third conditional uses past perfect in if clause', },
      { question: "Which is correct: 'Provided that you _____ early, you can come.'", options: ['arrive', 'arrives', 'arrived', 'arriving'], correctAnswer: 'arrive', explanation: 'Provided that uses present simple like "if"', },
      { question: "Choose: 'In case it _____ tomorrow, bring an umbrella.'", options: ['rain', 'rains', 'rained', 'raining'], correctAnswer: 'rains', explanation: 'In case uses present simple for future possibility', },
      { question: "Fill in: 'If I _____ rich, I would buy a house.'", options: ['am', 'was', 'were', 'will be'], correctAnswer: 'were', explanation: 'Second conditional uses "were" for all persons', },
      { question: "Choose: 'If I had studied harder, I _____ passed the exam.'", options: ['will', 'would', 'would have', 'had'], correctAnswer: 'would have', explanation: 'Third conditional uses "would have" + past participle', },
      { question: "Complete: 'Unless you _____ soon, you\'ll miss the train.'", options: ['leave', 'leaves', 'left', 'leaving'], correctAnswer: 'leave', explanation: 'Unless means "if not" - use present simple', },
      { question: "Fill in: 'If I _____ you, I would accept the job.'", options: ['am', 'was', 'were', 'will be'], correctAnswer: 'were', explanation: 'Second conditional with "if I were you"', },

      // Passive Voice
      { question: "Choose the passive form: 'The letter _____ yesterday.'", options: ['send', 'sends', 'was sent', 'sent'], correctAnswer: 'was sent', explanation: 'Passive voice uses be + past participle', },
      { question: "Fill in: 'The house _____ by the fire.'", options: ['destroy', 'destroys', 'was destroyed', 'destroyed'], correctAnswer: 'was destroyed', explanation: 'Passive voice in past tense', },
      { question: "Which is passive: 'The book _____ by Shakespeare.'", options: ['write', 'writes', 'was written', 'wrote'], correctAnswer: 'was written', explanation: 'Passive voice shows the action was done to the subject', },
      { question: "Choose: 'The car _____ by the mechanic.'", options: ['fix', 'fixes', 'was fixed', 'fixed'], correctAnswer: 'was fixed', explanation: 'Passive voice in past tense', },
      { question: "Fill in: 'The movie _____ last week.'", options: ['release', 'releases', 'was released', 'released'], correctAnswer: 'was released', explanation: 'Passive voice for past action', },

      // Reported Speech
      { question: "Choose the reported speech: 'He said he _____ tired.'", options: ['is', 'was', 'will be', 'has been'], correctAnswer: 'was', explanation: 'Present becomes past in reported speech', },
      { question: "Fill in: 'She said she _____ the book.'", options: ['read', 'reads', 'had read', 'will read'], correctAnswer: 'had read', explanation: 'Past simple becomes past perfect in reported speech', },
      { question: "Which is correct: 'He said he _____ tomorrow.'", options: ['comes', 'came', 'would come', 'will come'], correctAnswer: 'would come', explanation: 'Will becomes would in reported speech', },
      { question: "Choose: 'She said she _____ to Paris.'", options: ['go', 'goes', 'had been', 'has been'], correctAnswer: 'had been', explanation: 'Present perfect becomes past perfect in reported speech', },
      { question: "Fill in: 'They said they _____ the work.'", options: ['finish', 'finished', 'had finished', 'will finish'], correctAnswer: 'had finished', explanation: 'Past simple becomes past perfect in reported speech', },

      // Gerunds and Infinitives
      { question: "Choose the correct form: 'I enjoy _____ books.'", options: ['read', 'reads', 'reading', 'to read'], correctAnswer: 'reading', explanation: 'Enjoy is followed by gerund (-ing form)', },
      { question: "Fill in: 'She wants _____ a doctor.'", options: ['be', 'being', 'to be', 'is'], correctAnswer: 'to be', explanation: 'Want is followed by infinitive (to + base form)', },
      { question: "Which is correct: 'I stopped _____ when I was 20.'", options: ['smoke', 'smokes', 'smoking', 'to smoke'], correctAnswer: 'smoking', explanation: 'Stop is followed by gerund when meaning "quit"', },
      { question: "Choose: 'He decided _____ the job.'", options: ['accept', 'accepts', 'accepting', 'to accept'], correctAnswer: 'to accept', explanation: 'Decide is followed by infinitive', },
      { question: "Fill in: 'I suggest _____ early.'", options: ['leave', 'leaves', 'leaving', 'to leave'], correctAnswer: 'leaving', explanation: 'Suggest is followed by gerund', },
      { question: "Which is correct: 'I need _____ some money.'", options: ['borrow', 'borrows', 'borrowing', 'to borrow'], correctAnswer: 'to borrow', explanation: 'Need is followed by infinitive', },
      { question: "Choose: 'She finished _____ the book.'", options: ['read', 'reads', 'reading', 'to read'], correctAnswer: 'reading', explanation: 'Finish is followed by gerund', },
      { question: "Fill in: 'He agreed _____ the proposal.'", options: ['accept', 'accepts', 'accepting', 'to accept'], correctAnswer: 'to accept', explanation: 'Agree is followed by infinitive', },
      { question: "Which is correct: 'I can\'t help _____ about it.'", options: ['think', 'thinks', 'thinking', 'to think'], correctAnswer: 'thinking', explanation: 'Can\'t help is followed by gerund', },
      { question: "Choose: 'She promised _____ on time.'", options: ['arrive', 'arrives', 'arriving', 'to arrive'], correctAnswer: 'to arrive', explanation: 'Promise is followed by infinitive', },
      { question: "Fill in: 'She wants _____ a doctor.'", options: ['be', 'being', 'to be', 'is'], correctAnswer: 'to be', explanation: 'Want is followed by infinitive (to + base form)', },
      { question: "Which is correct: 'I stopped _____ when I was 20.'", options: ['smoke', 'smokes', 'smoking', 'to smoke'], correctAnswer: 'smoking', explanation: 'Stop is followed by gerund when meaning "quit"', },
      { question: "Choose: 'He decided _____ the job.'", options: ['accept', 'accepts', 'accepting', 'to accept'], correctAnswer: 'to accept', explanation: 'Decide is followed by infinitive', },
      { question: "Fill in: 'I suggest _____ early.'", options: ['leave', 'leaves', 'leaving', 'to leave'], correctAnswer: 'leaving', explanation: 'Suggest is followed by gerund', },

      // Modal Verbs
      { question: "Choose the correct modal: 'You _____ study hard to pass.'", options: ['can', 'could', 'must', 'might'], correctAnswer: 'must', explanation: 'Must shows necessity', },
      { question: "Fill in: 'I _____ speak French when I was young.'", options: ['can', 'could', 'must', 'should'], correctAnswer: 'could', explanation: 'Could shows past ability', },
      { question: "Which modal is correct: 'You _____ see a doctor.'", options: ['can', 'could', 'should', 'would'], correctAnswer: 'should', explanation: 'Should shows advice', },
      { question: "Choose: 'She _____ be at home now.'", options: ['can', 'could', 'might', 'must'], correctAnswer: 'might', explanation: 'Might shows possibility', },
      { question: "Fill in: 'You _____ not smoke here.'", options: ['can', 'could', 'must', 'should'], correctAnswer: 'must', explanation: 'Must not shows prohibition', },

      // Punctuation
      { question: "Choose the correct punctuation: 'Its time to go.'", options: ['Its', 'It\'s', 'Its\'', 'Its\'s'], correctAnswer: 'It\'s', explanation: 'It\'s = it is (contraction)', },
      { question: "Fill in: 'The childrens toys are everywhere.'", options: ['childrens', 'children\'s', 'childrens\'', 'childrens\'s'], correctAnswer: 'children\'s', explanation: 'Children\'s shows possession', },
      { question: "Which is correct: 'I dont know.'", options: ['dont', 'don\'t', 'dont\'', 'dont\'s'], correctAnswer: 'don\'t', explanation: 'Don\'t = do not (contraction)', },
      { question: "Choose: 'The dogs tail is wagging.'", options: ['dogs', 'dog\'s', 'dogs\'', 'dogs\'s'], correctAnswer: 'dog\'s', explanation: 'Dog\'s shows possession', },
      { question: "Fill in: 'Shes going to the store.'", options: ['Shes', 'She\'s', 'Shes\'', 'Shes\'s'], correctAnswer: 'She\'s', explanation: 'She\'s = she is (contraction)', },
      { question: "Which is correct: 'The womens room is over there.'", options: ['womens', 'women\'s', 'womens\'', 'womens\'s'], correctAnswer: 'women\'s', explanation: 'Women\'s shows possession', },
      { question: "Choose: 'We cant go today.'", options: ['cant', 'can\'t', 'cant\'', 'cant\'s'], correctAnswer: 'can\'t', explanation: 'Can\'t = cannot (contraction)', },
      { question: "Fill in: 'The mens shoes are expensive.'", options: ['mens', 'men\'s', 'mens\'', 'mens\'s'], correctAnswer: 'men\'s', explanation: 'Men\'s shows possession', },
      { question: "Which is correct: 'Theyre coming tomorrow.'", options: ['Theyre', 'They\'re', 'Theyres', 'Theyres\''], correctAnswer: 'They\'re', explanation: 'They\'re = they are (contraction)', },
      { question: "Choose: 'The peoples choice was clear.'", options: ['peoples', 'people\'s', 'peoples\'', 'peoples\'s'], correctAnswer: 'people\'s', explanation: 'People\'s shows possession', },
      { question: "Fill in: 'The childrens toys are everywhere.'", options: ['childrens', 'children\'s', 'childrens\'', 'childrens\'s'], correctAnswer: 'children\'s', explanation: 'Children\'s shows possession', },
      { question: "Which is correct: 'I dont know.'", options: ['dont', 'don\'t', 'dont\'', 'dont\'s'], correctAnswer: 'don\'t', explanation: 'Don\'t = do not (contraction)', },
      { question: "Choose: 'The dogs tail is wagging.'", options: ['dogs', 'dog\'s', 'dogs\'', 'dogs\'s'], correctAnswer: 'dog\'s', explanation: 'Dog\'s shows possession', },
      { question: "Fill in: 'Shes going to the store.'", options: ['Shes', 'She\'s', 'Shes\'', 'Shes\'s'], correctAnswer: 'She\'s', explanation: 'She\'s = she is (contraction)', },

      // Word Order and Sentence Types
      { question: "Which is a declarative sentence?", options: ['What time is it?', 'Please help me.', 'The sky is blue.', 'How beautiful!',], correctAnswer: 'The sky is blue.', explanation: 'Declarative sentences make statements', },
      { question: "Choose the interrogative sentence:", options: ['I am tired.', 'Please sit down.', 'Where are you going?', 'What a day!',], correctAnswer: 'Where are you going?', explanation: 'Interrogative sentences ask questions', },
      { question: "Which is an imperative sentence?", options: ['The door is open.', 'Close the door.', 'Is the door open?', 'What a door!',], correctAnswer: 'Close the door.', explanation: 'Imperative sentences give commands', },
      { question: "Choose the exclamatory sentence:", options: ['I am happy.', 'Are you happy?', 'Be happy.', 'How happy I am!',], correctAnswer: 'How happy I am!', explanation: 'Exclamatory sentences express strong emotion', },
      { question: "Which sentence has correct word order?", options: ['Yesterday I went to the store.', 'I went yesterday to the store.', 'I went to the store yesterday.', 'I went to the store yesterday.',], correctAnswer: 'I went to the store yesterday.', explanation: 'Time expressions usually go at the end', },

      // Vocabulary and Word Choice
      { question: "Choose the correct word: 'The weather is _____ today.'", options: ['good', 'well', 'better', 'best'], correctAnswer: 'good', explanation: 'Good is an adjective describing weather', },
      { question: "Fill in: 'She plays the piano _____.'", options: ['good', 'well', 'better', 'best'], correctAnswer: 'well', explanation: 'Well is an adverb describing how she plays', },
      { question: "Which word is correct: 'I have _____ friends.'", options: ['much', 'many', 'lot', 'few'], correctAnswer: 'many', explanation: 'Many is used with countable nouns', },
      { question: "Choose: 'There is _____ water in the glass.'", options: ['much', 'many', 'lot', 'few'], correctAnswer: 'much', explanation: 'Much is used with uncountable nouns', },
      { question: "Fill in: 'I have _____ time to help you.'", options: ['little', 'few', 'lot', 'many'], correctAnswer: 'little', explanation: 'Little is used with uncountable nouns', },
      { question: "Which is correct: 'The movie was _____ interesting.'", options: ['very', 'much', 'many', 'lot'], correctAnswer: 'very', explanation: 'Very is used with adjectives', },
      { question: "Choose: 'I _____ like to go to the movies.'", options: ['would', 'will', 'can', 'may'], correctAnswer: 'would', explanation: 'Would like is a polite way to express desire', },
      { question: "Fill in: 'She is _____ than her sister.'", options: ['tall', 'taller', 'tallest', 'more tall'], correctAnswer: 'taller', explanation: 'Taller is the comparative form', },
      { question: "Which word is correct: 'This is the _____ book I\'ve ever read.'", options: ['good', 'better', 'best', 'more good'], correctAnswer: 'best', explanation: 'Best is the superlative form of good', },
      { question: "Choose: 'I _____ to the store yesterday.'", options: ['go', 'went', 'gone', 'going'], correctAnswer: 'went', explanation: 'Went is the past tense of go', },
      { question: "Fill in: 'She plays the piano _____.'", options: ['good', 'well', 'better', 'best'], correctAnswer: 'well', explanation: 'Well is an adverb describing how she plays', },
      { question: "Which word is correct: 'I have _____ friends.'", options: ['much', 'many', 'lot', 'few'], correctAnswer: 'many', explanation: 'Many is used with countable nouns', },
      { question: "Choose: 'There is _____ water in the glass.'", options: ['much', 'many', 'lot', 'few'], correctAnswer: 'much', explanation: 'Much is used with uncountable nouns', },
      { question: "Fill in: 'I have _____ time to help you.'", options: ['little', 'few', 'lot', 'many'], correctAnswer: 'little', explanation: 'Little is used with uncountable nouns', },

      // Common Errors
      { question: "Which sentence is correct?", options: ['I am agree with you.', 'I agree with you.', 'I am agreeing with you.', 'I have agree with you.',], correctAnswer: 'I agree with you.', explanation: 'Agree is not used with "am"', },
      { question: "Choose the correct form: 'I am _____ to school.'", options: ['go', 'going', 'goes', 'went'], correctAnswer: 'going', explanation: 'Present continuous uses be + -ing', },
      { question: "Which is correct: 'I have _____ my homework.'", options: ['do', 'did', 'done', 'doing'], correctAnswer: 'done', explanation: 'Present perfect uses have + past participle', },
      { question: "Choose: 'She _____ to the party last night.'", options: ['go', 'goes', 'went', 'gone'], correctAnswer: 'went', explanation: 'Past simple uses the past form', },
      { question: "Fill in: 'I _____ never been to Paris.'", options: ['am', 'have', 'has', 'had'], correctAnswer: 'have', explanation: 'Present perfect uses have/has + past participle', },

      // Advanced Grammar
      { question: "Choose the correct form: 'I wish I _____ rich.'", options: ['am', 'was', 'were', 'will be'], correctAnswer: 'were', explanation: 'Wish + past subjunctive (were for all persons)', },
      { question: "Fill in: 'It\'s time we _____ home.'", options: ['go', 'went', 'going', 'to go'], correctAnswer: 'went', explanation: 'It\'s time + past simple (subjunctive)', },
      { question: "Which is correct: 'I would rather you _____ here.'", options: ['stay', 'stayed', 'staying', 'to stay'], correctAnswer: 'stayed', explanation: 'Would rather + past simple (subjunctive)', },
      { question: "Choose: 'If only I _____ the truth.'", options: ['know', 'knew', 'knowing', 'to know'], correctAnswer: 'knew', explanation: 'If only + past simple (subjunctive)', },
      { question: "Fill in: 'I suggest that he _____ early.'", options: ['leave', 'leaves', 'left', 'leaving'], correctAnswer: 'leave', explanation: 'Suggest + that + base form (subjunctive)', },
      { question: "Which is correct: 'I demand that she _____ the truth.'", options: ['tell', 'tells', 'told', 'telling'], correctAnswer: 'tell', explanation: 'Demand + that + base form (subjunctive)', },
      { question: "Choose: 'It\'s high time we _____ something.'", options: ['do', 'did', 'doing', 'to do'], correctAnswer: 'did', explanation: 'It\'s high time + past simple (subjunctive)', },
      { question: "Fill in: 'I insist that he _____ present.'", options: ['be', 'is', 'was', 'being'], correctAnswer: 'be', explanation: 'Insist + that + base form (subjunctive)', },
      { question: "Which is correct: 'I recommend that you _____ early.'", options: ['arrive', 'arrives', 'arrived', 'arriving'], correctAnswer: 'arrive', explanation: 'Recommend + that + base form (subjunctive)', },
      { question: "Choose: 'I propose that we _____ a meeting.'", options: ['have', 'has', 'had', 'having'], correctAnswer: 'have', explanation: 'Propose + that + base form (subjunctive)', },
      { question: "Fill in: 'It\'s time we _____ home.'", options: ['go', 'went', 'going', 'to go'], correctAnswer: 'went', explanation: 'It\'s time + past simple (subjunctive)', },
      { question: "Which is correct: 'I would rather you _____ here.'", options: ['stay', 'stayed', 'staying', 'to stay'], correctAnswer: 'stayed', explanation: 'Would rather + past simple (subjunctive)', },
      { question: "Choose: 'If only I _____ the truth.'", options: ['know', 'knew', 'knowing', 'to know'], correctAnswer: 'knew', explanation: 'If only + past simple (subjunctive)', },
      { question: "Fill in: 'I suggest that he _____ early.'", options: ['leave', 'leaves', 'left', 'leaving'], correctAnswer: 'leave', explanation: 'Suggest + that + base form (subjunctive)', },

      // Phrasal Verbs
      { question: "Choose the correct phrasal verb: 'Please _____ the light.'", options: ['turn on', 'turn in', 'turn up', 'turn down'], correctAnswer: 'turn on', explanation: 'Turn on means to switch on', },
      { question: "Fill in: 'I need to _____ this form.'", options: ['fill in', 'fill up', 'fill out', 'fill down'], correctAnswer: 'fill out', explanation: 'Fill out means to complete a form', },
      { question: "Which phrasal verb is correct: 'The meeting was _____.'", options: ['put off', 'put on', 'put up', 'put down'], correctAnswer: 'put off', explanation: 'Put off means to postpone', },
      { question: "Choose: 'She _____ her coat.'", options: ['put on', 'put off', 'put up', 'put down'], correctAnswer: 'put on', explanation: 'Put on means to wear', },
      { question: "Fill in: 'Please _____ the volume.'", options: ['turn up', 'turn down', 'turn on', 'turn off'], correctAnswer: 'turn down', explanation: 'Turn down means to reduce volume', },

      // Idioms and Expressions
      { question: "What does 'break the ice' mean?", options: ['To break something', 'To start a conversation', 'To be cold', 'To be angry',], correctAnswer: 'To start a conversation', explanation: 'Break the ice means to start a conversation in a social situation', },
      { question: "Choose the meaning of 'piece of cake':", options: ['Something to eat', 'Something easy', 'Something difficult', 'Something expensive',], correctAnswer: 'Something easy', explanation: 'Piece of cake means something very easy', },
      { question: "What does 'hit the nail on the head' mean?", options: ['To hit something', 'To be exactly right', 'To be wrong', 'To be angry',], correctAnswer: 'To be exactly right', explanation: 'Hit the nail on the head means to be exactly correct', },
      { question: "Choose: 'What does \'pull someone\'s leg\' mean?'", options: ['To hurt someone', 'To joke with someone', 'To help someone', 'To ignore someone',], correctAnswer: 'To joke with someone', explanation: 'Pull someone\'s leg means to tease or joke with them', },
      { question: "Fill in: 'What does \'cost an arm and a leg\' mean?'", options: ['To be expensive', 'To be cheap', 'To be painful', 'To be difficult',], correctAnswer: 'To be expensive', explanation: 'Cost an arm and a leg means to be very expensive', },

      // Collocations and Word Combinations
      { question: "Choose the correct collocation: 'I need to _____ a decision.'", options: ['make', 'do', 'take', 'have'], correctAnswer: 'make', explanation: 'Make a decision is the correct collocation', },
      { question: "Fill in: 'She _____ a mistake.'", options: ['made', 'did', 'took', 'had'], correctAnswer: 'made', explanation: 'Make a mistake is the correct collocation', },
      { question: "Which is correct: 'I _____ my homework.'", options: ['make', 'do', 'take', 'have'], correctAnswer: 'do', explanation: 'Do homework is the correct collocation', },
      { question: "Choose: 'He _____ a shower every morning.'", options: ['makes', 'does', 'takes', 'has'], correctAnswer: 'takes', explanation: 'Take a shower is the correct collocation', },
      { question: "Fill in: 'We _____ dinner at 8 PM.'", options: ['make', 'do', 'take', 'have'], correctAnswer: 'have', explanation: 'Have dinner is the correct collocation', },

      // Quantifiers and Determiners
      { question: "Choose the correct quantifier: 'I have _____ friends.'", options: ['much', 'many', 'lot', 'few'], correctAnswer: 'many', explanation: 'Many is used with countable nouns', },
      { question: "Fill in: 'There is _____ milk in the fridge.'", options: ['much', 'many', 'lot', 'few'], correctAnswer: 'much', explanation: 'Much is used with uncountable nouns', },
      { question: "Which is correct: 'I have _____ time to help.'", options: ['little', 'few', 'lot', 'many'], correctAnswer: 'little', explanation: 'Little is used with uncountable nouns', },
      { question: "Choose: 'There are _____ people here.'", options: ['little', 'few', 'lot', 'much'], correctAnswer: 'few', explanation: 'Few is used with countable nouns', },
      { question: "Fill in: 'She has _____ experience in this field.'", options: ['much', 'many', 'lot', 'few'], correctAnswer: 'much', explanation: 'Much is used with uncountable nouns', },

      // Relative Clauses
      { question: "Choose the correct relative pronoun: 'The man _____ lives next door is a doctor.'", options: ['who', 'which', 'that', 'whom'], correctAnswer: 'who', explanation: 'Who refers to people as subjects', },
      { question: "Fill in: 'The book _____ I read was interesting.'", options: ['who', 'which', 'that', 'whom'], correctAnswer: 'which', explanation: 'Which refers to things', },
      { question: "Which is correct: 'The woman _____ I met yesterday is my teacher.'", options: ['who', 'which', 'that', 'whom'], correctAnswer: 'whom', explanation: 'Whom refers to people as objects', },
      { question: "Choose: 'The car _____ I bought is red.'", options: ['who', 'which', 'that', 'whom'], correctAnswer: 'that', explanation: 'That can refer to both people and things', },
      { question: "Fill in: 'The house _____ roof is red belongs to John.'", options: ['who', 'which', 'whose', 'whom'], correctAnswer: 'whose', explanation: 'Whose shows possession', },

      // Inversion and Emphasis
      { question: "Choose the correct inversion: '_____ did I see such beauty.'", options: ['Never', 'Seldom', 'Rarely', 'Hardly'], correctAnswer: 'Never', explanation: 'Never + auxiliary + subject for emphasis', },
      { question: "Fill in: '_____ had I arrived when it started to rain.'", options: ['No sooner', 'Hardly', 'Scarcely', 'Rarely'], correctAnswer: 'Hardly', explanation: 'Hardly + had + subject + past participle', },
      { question: "Which is correct: '_____ do I see him these days.'", options: ['Never', 'Seldom', 'Rarely', 'Hardly'], correctAnswer: 'Seldom', explanation: 'Seldom + auxiliary + subject for emphasis', },
      { question: "Choose: '_____ had she left when he called.'", options: ['No sooner', 'Hardly', 'Scarcely', 'Rarely'], correctAnswer: 'Scarcely', explanation: 'Scarcely + had + subject + past participle', },
      { question: "Fill in: '_____ did I expect such a surprise.'", options: ['Never', 'Seldom', 'Rarely', 'Hardly'], correctAnswer: 'Rarely', explanation: 'Rarely + auxiliary + subject for emphasis', },

      // Cleft Sentences
      { question: "Choose the correct cleft sentence: '_____ was John who called.'", options: ['It', 'There', 'This', 'That'], correctAnswer: 'It', explanation: 'It cleft sentences emphasize the subject', },
      { question: "Fill in: '_____ I want is a cup of coffee.'", options: ['What', 'That', 'Which', 'Who'], correctAnswer: 'What', explanation: 'What cleft sentences emphasize the object', },
      { question: "Which is correct: '_____ happened was amazing.'", options: ['What', 'That', 'Which', 'Who'], correctAnswer: 'What', explanation: 'What happened emphasizes the event', },
      { question: "Choose: '_____ was in 2010 that I graduated.'", options: ['It', 'There', 'This', 'That'], correctAnswer: 'It', explanation: 'It cleft sentences emphasize time', },
      { question: "Fill in: '_____ I need is more time.'", options: ['What', 'That', 'Which', 'Who'], correctAnswer: 'What', explanation: 'What I need emphasizes the requirement', },

      // Discourse Markers and Connectors
      { question: "Choose the correct connector: 'I was tired; _____, I went to bed.'", options: ['however', 'therefore', 'moreover', 'nevertheless'], correctAnswer: 'therefore', explanation: 'Therefore shows result/conclusion', },
      { question: "Fill in: 'It was raining; _____, we went for a walk.'", options: ['however', 'therefore', 'moreover', 'nevertheless'], correctAnswer: 'nevertheless', explanation: 'Nevertheless shows contrast/despite', },
      { question: "Which is correct: 'He is smart; _____, he is kind.'", options: ['however', 'therefore', 'moreover', 'nevertheless'], correctAnswer: 'moreover', explanation: 'Moreover adds additional information', },
      { question: "Choose: 'She was late; _____, she missed the meeting.'", options: ['however', 'therefore', 'moreover', 'nevertheless'], correctAnswer: 'therefore', explanation: 'Therefore shows cause and effect', },
      { question: "Fill in: 'The food was expensive; _____, it was delicious.'", options: ['however', 'therefore', 'moreover', 'nevertheless'], correctAnswer: 'however', explanation: 'However shows contrast', },

      // Academic Writing and Formal Language
      { question: "Choose the formal equivalent: 'I think that...'", options: ['I believe that', 'I reckon that', 'I guess that', 'I figure that'], correctAnswer: 'I believe that', explanation: 'I believe that is more formal than the others', },
      { question: "Fill in: 'The results _____ that...'", options: ['show', 'indicate', 'tell', 'say'], correctAnswer: 'indicate', explanation: 'Indicate is more formal than show', },
      { question: "Which is formal: 'This _____ to the conclusion that...'", options: ['leads', 'gets', 'comes', 'goes'], correctAnswer: 'leads', explanation: 'Leads is more formal than the others', },
      { question: "Choose: 'The study _____ that...'", options: ['finds', 'discovers', 'reveals', 'sees'], correctAnswer: 'reveals', explanation: 'Reveals is more formal than finds', },
      { question: "Fill in: 'This _____ the importance of...'", options: ['shows', 'demonstrates', 'tells', 'says'], correctAnswer: 'demonstrates', explanation: 'Demonstrates is more formal than shows', },

      // Business and Professional English
      { question: "Choose the business phrase: 'I would like to _____ your attention to...'", options: ['get', 'draw', 'take', 'bring'], correctAnswer: 'draw', explanation: 'Draw attention is a formal business phrase', },
      { question: "Fill in: 'Please _____ me know if you need anything.'", options: ['let', 'make', 'have', 'get'], correctAnswer: 'let', explanation: 'Let me know is a common business phrase', },
      { question: "Which is correct: 'I look forward to _____ from you.'", options: ['hear', 'hearing', 'heard', 'hears'], correctAnswer: 'hearing', explanation: 'Look forward to + gerund', },
      { question: "Choose: 'Please _____ the attached document.'", options: ['find', 'see', 'look', 'check'], correctAnswer: 'find', explanation: 'Please find attached is a business email phrase', },
      { question: "Fill in: 'I _____ your cooperation.'", options: ['appreciate', 'like', 'want', 'need'], correctAnswer: 'appreciate', explanation: 'Appreciate is more formal than like', },

      // Multiple Choice Questions
      { type: 'multiple', question: 'Which of the following are nouns?', options: ['cat', 'run', 'happiness', 'blue'], correctAnswer: ['cat', 'happiness'], explanation: '"Cat" is a concrete noun, "happiness" is an abstract noun. "Run" is a verb, "blue" is an adjective.', },
      { type: 'multiple', question: 'Which words are irregular verbs?', options: ['go', 'walk', 'eat', 'play'], correctAnswer: ['go', 'eat'], explanation: 'Go (go/went/gone) and eat (eat/ate/eaten) are irregular. Walk and play are regular.', },
      { type: 'multiple', question: 'Which are modal verbs?', options: ['can', 'will', 'have', 'should'], correctAnswer: ['can', 'will', 'should'], explanation: 'Can, will, and should are modal verbs. Have is a regular verb.', },
      { type: 'multiple', question: 'Which words are prepositions?', options: ['in', 'on', 'and', 'at'], correctAnswer: ['in', 'on', 'at'], explanation: 'In, on, and at are prepositions. And is a conjunction.', },
      { type: 'multiple', question: 'Which are comparative adjectives?', options: ['bigger', 'more beautiful', 'tallest', 'faster'], correctAnswer: ['bigger', 'more beautiful', 'faster'], explanation: 'Bigger, more beautiful, and faster are comparatives. Tallest is superlative.', },
      { type: 'multiple', question: 'Which words are linking verbs?', options: ['is', 'become', 'seem', 'run'], correctAnswer: ['is', 'become', 'seem'], explanation: 'Is, become, and seem are linking verbs. Run is an action verb.', },
      { type: 'multiple', question: 'Which are indefinite pronouns?', options: ['someone', 'everyone', 'he', 'they'], correctAnswer: ['someone', 'everyone'], explanation: 'Someone and everyone are indefinite pronouns. He and they are personal pronouns.', },
      { type: 'multiple', question: 'Which words are adverbs of frequency?', options: ['often', 'quickly', 'always', 'here'], correctAnswer: ['often', 'always'], explanation: 'Often and always are adverbs of frequency. Quickly is manner, here is place.', },
      { type: 'multiple', question: 'Which are subordinating conjunctions?', options: ['because', 'and', 'although', 'but'], correctAnswer: ['because', 'although'], explanation: 'Because and although are subordinating conjunctions. And and but are coordinating.', },
      { type: 'multiple', question: 'Which words are demonstrative adjectives?', options: ['this', 'that', 'these', 'those'], correctAnswer: ['this', 'that', 'these', 'those'], explanation: 'All four are demonstrative adjectives/pronouns.', },
      { type: 'multiple', question: 'Which words are irregular verbs?', options: ['go', 'walk', 'eat', 'play'], correctAnswer: ['go', 'eat'], explanation: 'Go (go/went/gone) and eat (eat/ate/eaten) are irregular. Walk and play are regular.', },
      { type: 'multiple', question: 'Which are modal verbs?', options: ['can', 'will', 'have', 'should'], correctAnswer: ['can', 'will', 'should'], explanation: 'Can, will, and should are modal verbs. Have is a regular verb.', },
      { type: 'multiple', question: 'Which words are prepositions?', options: ['in', 'on', 'and', 'at'], correctAnswer: ['in', 'on', 'at'], explanation: 'In, on, and at are prepositions. And is a conjunction.', },
      { type: 'multiple', question: 'Which are comparative adjectives?', options: ['bigger', 'more beautiful', 'tallest', 'faster'], correctAnswer: ['bigger', 'more beautiful', 'faster'], explanation: 'Bigger, more beautiful, and faster are comparatives. Tallest is superlative.', },
    ];

    // Get available questions (filter out already used ones in this quiz)
    const availableQuestions = getAvailableQuestions(questions, usedQuestions);

    // If no available questions, use all questions
    if (availableQuestions.length === 0) {
      return questions[Math.floor(Math.random() * questions.length)];
    }

    // Return a random available question
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }


}

// Initialize the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Insert header
  insertHeader();

  // Populate common configuration
  const commonConfigContainer = document.getElementById('common-config');
  if (commonConfigContainer) {
    commonConfigContainer.classList.add('grammar-config-row');
    commonConfigContainer.innerHTML = generateCommonConfigHTML();
  }

  // Create question generator
  const questionGenerator = new GrammarQuestionGenerator();

  

  // Create quiz manager
  const quizManager = new CommonQuizManager();
  quizManager.setQuestionGenerator(questionGenerator);
  quizManager.setQuizTitle('English Grammar Quiz');


});
