/**
 * Created by Rory on 16/04/2016.
 */
angular.module('upDooter').service('MemeMachine', function() {
    var Sentencer = window.Sentencer;
    var _ = window._;

    var tags = [];
    var count = 0;
    var getImage = function() {
        count ++;
        return 'http://lorempixel.com/500/380/?'+count;
    };


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
                    return _.sample(['meme','dank meme','banger','gem']);
                }else{
                    return Sentencer.make("{{ noun }}");
                }
            },
            gf: function() {
                return _.sample(['GF','SO','partner','girlfriend','mum','mother','roommate']);
            },
            made: function() {
                return _.sample(['made','drew','painted','modelled','rendered','ruined','photoshopped']);
            },
            IAMA: function() {
                return _.sample(['IAMA','IAM','I am']);
            },
            AMA: function() {
                return _.sample(['AMA','AMAA','ask me anything','ask me almost anything']);
            },
            tag: function(action) {
                var response = Sentencer.make("{{ "+action+" }}");
                tags.push(response);
                console.log(response);
                return response;
            }
        }
    });

    return {
        getPost: function () {
            tags = [];
            var text = Sentencer.make(_.sample([
                "{{ DAE }} remember this {{ tag('opt_adjective') }}{{ tag('meme_noun') }}?",
                "My {{ gf }} {{ made }} this {{ tag('opt_adjective') }} {{ tag('noun') }}",
                "{{ TFW }} {{ your }} {{ tag('noun') }} {{ tag('verbs') }}",
                "Instructions unclear, {{ tag('noun') }} stuck in {{ tag('noun') }}",
                "ELI5 how {{ your }} {{ noun }} {{ verbs }}",
                "They say you are what you eat, but I don't remember eating {{ tag('an_adjective') }} {{ tag('noun') }}",
                "{{ IAMA }} {{ tag('an_adjective') }} {{ tag('noun') }}, {{ AMA }}"
            ]));

            return {
                text: text,
                image: getImage()
            }
        }
    };
});