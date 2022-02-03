import React, { useEffect, useState } from 'react';

import OtterBooth from "../assets/otter_booth.svg";
import SignDarkerRight from "../assets/sign_darker_right.svg";
import SignLighterRight from "../assets/sign_lighter.svg";
import QuestionMark from "../assets/questionmark.svg";
import DownArrow from "../assets/faq_dropdown_down.svg";
import UpArrow from "../assets/faq_dropdown_up.svg";

import "../styles/Faq.css";

const questions = [
    {
        question: 'What is a hackathon?',
        answer: 'Hackathons are often described as a hybrid between a career fair and a science fair. A creative community of programmers - from novices to experienced - come together for 36 hours to make amazing projects. The projects are then judged by tech professionals from industry and academia, and winners receive awesome prizes!'
    },
    {
        question: 'When will SB Hacks take place?',
        answer: 'SB Hacks VIII will take place on Friday, February 4, 2022, and conclude on Sunday, February 6, 2022. Originally the event was scheduled for January 14 - 16, 2022 but was postponed due university concerns over Covid.'
    },
    {
        question: 'Who can attend?',
        answer: 'SB Hacks is accepting undergraduate students, graduate / Ph.D. students, and graduates who completed their degrees within the past year.'
    },
    {
        question: 'What should I bring?',
        answer: 'The event will take place virtually, so you can participate from the comfort of your home!. You will need your laptop, food/water, and plenty of energy :)'
    },
    {
        question: 'What can I win?',
        answer: 'We have a lot of great prizes ready for this year! They are being announced on our Instagram so go check it out!'
    },
    {
        question: 'Are there any rules I should follow?',
        answer: 'You can find the MLH code of conduct at https://static.mlh.io/docs/mlh-code-of-conduct.pdf.'
    },
    {
        question: 'Update after the UC System’s move to remote instruction until Jan. 31?',
        answer: 'We have postponed SB Hacks VIII to February 4 - 6, 2022 and are will be completely virtual.'
    },
    // {
    //     question: 'Do you offer travel assistance?',
    //     answer: 'TBD. Current travel plans to and from UCSB are uncertain, and we will update you as we find out more information.'
    // },
    {
        question: 'When can I apply, and when will acceptances come out?',
        answer: 'Applications are now open and will close on January 28, 2022. Acceptances will be released in waves starting January 29, 2022.'
    },
    {
        question: 'Can I compete in a team?',
        answer: 'Yes, the maximum is 4 people per team. If you do not enter with a team, no worries! A team formation event will take place at the start of the hackathon.'
    },
    {
        question: 'Will SB Hacks VIII be in-person?',
        answer: 'SB Hacks VIII will be held virtually, so you can participate from the comfort of your home!'
    },
    {
        question: 'Do I have to be a super experienced coder to attend?',
        answer: 'No, we welcome hackers from all experience levels and backgrounds. There will be beginner-friendly workshops to help you gain more experience in coding, and a category challenge designed just for beginners.'
    },
    {
        question: 'More questions?',
        answer: 'Feel free to email us with any questions at team@sbhacks.com.'
    },
]

const FAQ = () => {
    const [isOpen, setIsOpen] = useState([false, false, false, false, false, false, false, false, false, false, false, false]);
    const toggle = (index) => {
        let newIsOpen = [false, false, false, false, false, false, false, false, false, false, false, false];
        if (isOpen[index]) {
            setIsOpen(newIsOpen)
        }
        else {
            newIsOpen[index] = true;
            setIsOpen(newIsOpen);
        }
    }

    return (
        <div id='faq'>
            <div className='title'><img className='questionMark' src={QuestionMark} />FAQ</div>
            <div className='mainContent'>
                <div className='questions'>
                    {
                        questions.map((obj, index) => {
                            if (index < 6) {
                                let left = (index % 2 === 0) ? true : false;
                                let dark = (index % 2 === 0) ? true : false;
                                return <Sign question={obj.question} answer={obj.answer} dark={dark} left={left} open={isOpen[index]} toggle={() => toggle(index)} />
                            }
                            return undefined;
                        })

                    }
                </div>
                <img src={OtterBooth} id='otterBooth' />
                <div className='questions'>
                    {
                        questions.map((obj, index) => {
                            if (index >= 6) {
                                let left = (index % 2 === 0) ? false : true;
                                let dark = (index % 2 === 0) ? false : true;
                                return <Sign key={index} question={obj.question} answer={obj.answer} dark={dark} left={left} open={isOpen[index]} toggle={() => toggle(index)} />
                            }
                            return undefined;
                        })

                    }
                </div>
            </div>
        </div >
    )
}

export const Sign = (props) => {
    const [signImg, setSignImg] = useState(null);
    const [arrow, setArrow] = useState(null);
    const [style, setStyle] = useState({});
    const [up, setUp] = useState(false);

    useEffect(() => {
        if (props.dark) setSignImg(SignDarkerRight);
        else setSignImg(SignLighterRight);

        if (props.open) {
            setUp(true)
            setArrow(UpArrow);
        }
        else {
            setUp(false)
            setArrow(DownArrow);
        }

        if (props.left) setStyle({ transform: 'rotate(180deg)' })
    }, []);

    useEffect(() => {
        if (props.open) {
            setArrow(UpArrow);
            setUp(true);
        }
        else {
            setArrow(DownArrow);
            setUp(false);
        }
    }, [props.open]);

    return (
        <>
            <div className='sign' onClick={props.toggle}>
                <img className='signImg' src={signImg} style={style} />
                <img className='arrowImg' src={arrow} />
                {/* <img className='arrowImg' src={DownArrow} style={{ transform: up ? 'rotate(180deg)' : '' }} /> */}
                <div className='textContainer'><div className='text'> {props.question} </div></div>
            </div>
            {
                    props.open &&
                    <div className='ansText' style={{marginLeft: props.left ? '20%' : '5%'}}>
                        {props.answer}
                    </div>
                }
        </>
    )
}

export default FAQ;