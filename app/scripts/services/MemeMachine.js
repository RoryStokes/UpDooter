/**
 * Created by Rory on 16/04/2016.
 */
angular.module('upDooter').service('MemeMachine', function() {
    var Sentencer = window.Sentencer;
    var _ = window._;
    Sentencer.configure({
        actions: {
            TFW: function() {
                return _.sample(['TFW','That feel when', 'MFW', 'My face when', 'My reaction when']);
            },
            DAE: function() {
                return _.sample(['DAE','Does anyone else','Anyone else','You guys','Anyone']);
            },
            opt_adjective: function() {
                if(Math.random()<.5){
                    return "";
                }else{
                    return Sentencer.make("{{ adjective }} ");
                }
            },
            your: function() {
                return _.sample(['your','my','a'])
            },
            verbs: function() {
                return _.sample(['breaks','explodes','stops working','hits you','fights back','won\'t start','won\'t stop','smells bad','is angry','destroys the world']);
            },
            meme_noun: function() {
                if(Math.random()<.5){
                    return _.sample(['meme','dank meme','banger']);
                }else{
                    return Sentencer.make("{{ noun }}");
                }
            },
            gf: function() {
                return _.sample(['GF','SO','partner','girlfriend','mum','mother','roommate']);
            },
            made: function() {
                return _.sample(['made','drew','painted','modelled','rendered','ruined','photoshopped'])
            }
        }
    });

    return {
        getPost: function () {
            return Sentencer.make(_.sample([
                "{{ DAE }} remember this {{ opt_adjective }}{{ meme_noun }}?",
                "My {{ gf }} {{ made }} this {{ opt_adjective }} {{ noun }}",
                "{{ TFW }} {{ your }} {{ noun }} {{ verbs }}",
                "Instructions unclear, {{ noun }} stuck in {{ noun }}",
                "ELI5 how {{ your }} {{ noun }} {{ verbs }}",
                "They say you are what you eat, but I don't remember eating {{ an_adjective}} {{noun}}"
            ]));
        }
    };
});