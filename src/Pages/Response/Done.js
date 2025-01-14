import React, { useEffect, useState } from 'react';
import instance from '../../api/customAxios';
import Styles from './Done.module.css';
import ConfettiEffect from '../../components/ConfettiEffect';

import Btn from '../../components/Btn';
import WhiteBtn from '../../components/WhiteBtn';
import CustomModal from '../../components/CustomModal';

import { UserCookie } from '../../store/Create/UserCookie';
import { Answerer } from '../../store/Response/Answerer';
import { Response } from '../../store/Response/Response';

import { useRecoilState, useRecoilValue } from 'recoil';
import { AnswererToken } from '../../store/Response/AnswererToken';
import { useNavigate } from 'react-router-dom';
import { QuestionArr } from '../../store/Create/QuestionArr';
import { Challenge } from '../../store/Create/Challenge';
import { Questioner } from '../../store/Create/Questioner';
import { CounterSign } from '../../store/Create/CounterSign';
import { QuestionNum } from '../../store/Create/QuestionNum';
import { OriginQuestionArr } from '../../store/Create/OriginQuestionArr';
import { OriginQuestionNum } from '../../store/Create/OriginQuestionNum';

import { EventTrigger } from '../../gtag';

const Done = ({ goToFirstStep }) => {
  const answererJWT = useRecoilValue(AnswererToken);
  const answerer = useRecoilValue(Answerer);
  const response = useRecoilValue(Response);

  const diaryId = useRecoilValue(UserCookie);

  const [isCorrected, setIsCorrected] = useState(false);

  const [questioner, setQuestioner] = useRecoilState(Questioner);
  const [questionArr, setQuestionArr] = useRecoilState(QuestionArr);
  const [challenge, setChallenge] = useRecoilState(Challenge);
  const [questionNum, setQuestionNum] = useRecoilState(QuestionNum);
  const [countersign, setCountersign] = useRecoilState(CounterSign);
  const [originQuestionArr, setOriginQuestionArr] =
    useRecoilState(OriginQuestionArr);
  const [originQuestionNum, setOriginQuestionNum] =
    useRecoilState(OriginQuestionNum);

  const handleBeforeNavigate = () => {
    setIsCorrected(true);
    navigate(`/answerers/${diaryId}`);
  };

  useEffect(() => {
    const fetchUserCookie = async () => {
      try {
        const axiosInstance = instance(answererJWT);
        await axiosInstance.post(
          `diary/answer/${diaryId}`,
          {
            answerer: answerer,
            answers: response,
          },
          { withCredentials: true }
        );
      } catch (error) {
        if (error.response.status === 409) {
          setIsCorrected(true);
        }
      }
    };
    fetchUserCookie();
  }, []);

  const navigate = useNavigate('');

  const handleDisplayAnswerList = () => {
    navigate(`/answerers/${diaryId}`);
  };

  const handleMakeGomgom = () => {
    navigate('/');

    setQuestioner('');
    setQuestionArr(originQuestionArr);
    setChallenge('');
    setCountersign('');
    setQuestionNum(originQuestionNum);
    goToFirstStep();

    EventTrigger({
      action: '나도 만들기',
      category: 'make',
      label: '나도 만들기',
      value: 1,
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const location = window.location.origin;

  const handleKaKaoTalk = async () => {
    if (window.Kakao) {
      const Kakao = window.Kakao;

      const kakaoAPI = process.env.REACT_APP_KAKAO_API;

      if (!Kakao.isInitialized()) {
        await new Promise((resolve) => Kakao.init(kakaoAPI, resolve));
      }

      Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '곰곰다이어리',
          description: '상대에 대해 곰곰이 생각하고 답해보세요!',
          imageUrl: `${process.env.PUBLIC_URL}/image/OG_Thumb.png`,
          link: {
            mobileWebUrl: `${location}/answerers/${diaryId}`,
            webUrl: `${location}/answerers/${diaryId}`,
          },
        },
        buttons: [
          {
            title: '답장 알리기',
            link: {
              mobileWebUrl: `${location}/answerers/${diaryId}`,
              webUrl: `${location}/answerers/${diaryId}`,
            },
          },
        ],
      });
    }
  };

  return (
    <div>
      <ConfettiEffect />
      <div className={Styles.Done}>
        <div className={Styles.top}>
          <div>🎉</div>
          <div>곰곰다이어리가 완성됐어요!</div>
          <div>{useRecoilValue(Questioner)}님에게 알려보세요!</div>
        </div>
        <div className={Styles.middle}>
          <WhiteBtn
            text={'내 답장 확인하기'}
            onClick={() => handleDisplayAnswerList()}
          />
          <Btn text={'나도 만들기'} onClick={handleMakeGomgom} />
        </div>
      </div>
    </div>
  );
};

export default Done;
