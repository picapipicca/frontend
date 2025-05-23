import BottomSheet from '@/components/common/BottomSheet';
import ProfileImage from '@/components/common/ProfileImage';
import { IParticipant } from '@/types/response/Gathering';
import styles from './Members.module.scss';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/contexts/toastContext';
import { useRouter } from 'next/navigation';
import { useKickParticipant } from '@/api/queryHooks/gathering';
import Modal from '@/components/common/Modal';
import useModal from '@/hooks/useModal';

interface IMembersProps {
  modalOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  data: { userParticipantResponseList: IParticipant[]; meetingState: string };
  isMobile: boolean;
  meetingId: number;
  bottomSheetOpen: string;
  myType: 'LEADER' | 'PARTICIPANT' | 'NONE' | 'QUIT' | undefined;
  applyPlace?: string;
}

export default function Members({
  modalOpen,
  onClose,
  onOpen,
  data,
  isMobile,
  meetingId,
  bottomSheetOpen,
  myType,
  applyPlace,
}: IMembersProps) {
  // const buttonRef = useRef<HTMLButtonElement | null>(null);

  const h2Ref = useRef<HTMLUListElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { addToast } = useToast();
  const [kickButtonOn, setKickButtonOn] = useState(false);
  const [isFull, setIsFull] = useState(!!bottomSheetOpen);
  const router = useRouter();
  const kickParticipant = useKickParticipant(meetingId);
  const {
    modalOpen: checkModalOpen,
    handleModalOpen: handleChecksModalOpen,
    handleModalClose: handleCheckModalClose,
  } = useModal();

  const handleKickButtonClick = (userId: number, userName: string) => {
    kickParticipant.mutate(
      {
        userId,
        meetingId,
        meetingState: data.meetingState,
      },

      {
        onSuccess: () => {
          addToast(`${userName}님을 모임에서 내보냈습니다`, 'success');
        },
        onError: (error: any) => {
          if (error.response.data.errorCode === 400) {
            addToast('내보내기에 실패했습니다', 'error');
          } else {
            addToast(error.response.data.message, 'error');
          }
        },
      }
    );
  };

  const handleGoToOtherProfile = (id: number) => {
    if (applyPlace === 'thread') {
      router.push(`/other-profile/${id}`);
      return;
    }

    router.push(
      `/other-profile/${id}?id=${meetingId}&open=${isFull ? 'full' : 'half'}`
    );
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (h2Ref.current) {
        const isContentOverflowing =
          h2Ref.current.scrollHeight > h2Ref.current.clientHeight;
        setIsOverflowing(isContentOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  useEffect(() => {
    setKickButtonOn(myType === 'LEADER');
  }, [myType, setKickButtonOn]);

  return (
    <>
      <BottomSheet
        isOpen={modalOpen}
        onOpen={onOpen}
        onClose={onClose}
        full
        setIsFull={setIsFull}
        initialBottomSheetOpen={bottomSheetOpen}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <Image
              src={'/assets/icons/vector-251.svg'}
              alt="파란색 선"
              width={4}
              height={30}
            />
            참여자
          </h2>
          <button type="button" onClick={onClose}>
            <Image
              src={'/assets/icons/plus-circle.svg'}
              alt="닫기 버튼"
              width={30}
              height={30}
            />
          </button>
        </div>
        <div
          style={{
            height: `calc(100% - 141.14px)`,
            padding: isOverflowing
              ? isMobile
                ? '0 26px 0 19px'
                : '0 34px 0 0'
              : '',
          }}>
          <ul
            className={styles.profiles}
            style={{
              height: '100%',
              padding: isOverflowing
                ? isMobile
                  ? '0 26px 0 19px'
                  : '0 34px 0 19px'
                : '0 19px',
              margin: '0',
            }}
            ref={h2Ref}>
            {data.userParticipantResponseList.map(participant => {
              return (
                <div key={participant.userId} className={styles.profile}>
                  <button
                    className={styles.profilePart1}
                    onClick={() => {
                      handleGoToOtherProfile(participant.userId);
                    }}>
                    <div className={styles.crown}>
                      {participant.type === 'LEADER' && (
                        <Image
                          src={'/assets/icons/crown.svg'}
                          alt="왕관"
                          width={isMobile ? 20 : 26}
                          height={isMobile ? 20 : 26}
                        />
                      )}
                    </div>
                    <div style={{ borderRadius: '50%' }}>
                      <ProfileImage
                        url={participant.profileImage}
                        width={isMobile ? 28 : 36}
                        height={isMobile ? 28 : 36}
                      />
                    </div>
                    <p className={styles.nickname}>{participant.nickname}</p>
                  </button>
                  {kickButtonOn && participant.type !== 'LEADER' && (
                    <button
                      type="button"
                      className={styles.kick}
                      onClick={() => handleChecksModalOpen()}>
                      내보내기
                    </button>
                  )}
                  <Modal
                    modalOpen={checkModalOpen}
                    onClose={() => {
                      handleCheckModalClose();
                    }}
                    maxWidth={552}>
                    <div className={styles.modalBackground}>
                      <div className={styles.description}>
                        <div
                          style={{
                            flex: '1 1 0',
                            textAlign: 'center',
                            width: '318px',
                          }}>
                          <p>
                            <span className={styles.userName}>
                              {participant.nickname}
                            </span>{' '}
                            <br /> 내보내기 하시겠습니까?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.modalButtons}>
                      <button
                        type="button"
                        onClick={() => {
                          handleKickButtonClick(
                            participant.userId,
                            participant.nickname
                          );
                          handleCheckModalClose();
                        }}
                        className={styles.modalFirstButton}>
                        네
                      </button>

                      <button
                        type="button"
                        onClick={handleCheckModalClose}
                        className={styles.modalSecondButton}>
                        아니요
                      </button>
                    </div>
                  </Modal>
                </div>
              );
            })}
          </ul>
        </div>
      </BottomSheet>
    </>
  );
}
