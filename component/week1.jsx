import styles from "./styles/week1.module.scss";

const Week1 = () => (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.peoplePicture}></div>
        <div className={styles.postInformation}>
          <p className={styles.userName}>你的朋友</p>
          <p className={styles.releaseTime}>一小時前</p>
        </div>
      </div>
      <div className={styles.postContent}>
        <p className={styles.content}>
          動態動態動態動態動態動態, 動態動態動態動態。
        </p>
      </div>
      <div className={styles.postFeatures}>
        <div className={styles.feature1}></div>
        <div className={styles.feature2}></div>
      </div>
      <div className={styles.reach}>
        <p>7 人喜歡這則貼文</p>
        <p>1 則留言</p>
      </div>
      <div className={styles.linkBottom}></div>
      <div className={styles.postComment}>
        <img className={styles.profilePhoto} src="/image/下載.png" />
        <button className={styles.comment}>留個言吧</button>
      </div>
    </div>
  );

export default Week1;
