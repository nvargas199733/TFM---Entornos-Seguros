import Header from "../components/Header";

import Footer from "../components/Footer";

import UserReportCard from "../components/UserReportCard";

import reportsData from "../data/reportsData";

import "../styles/user-report-detail.css";
import { useParams } from "react-router-dom";
import policeVideo from "../assets/policia.mp4";

/*
  UserReportDetail:
  Vista detalle del reporte realizado por un usuario.
*/

const UserReportDetail = () => {
  /* Reporte ficticio */
  const { id } = useParams();

  const report = reportsData.find((item) => item.id === Number(id));

  return (
    <div className="user-report-detail">
      <Header />

      <main className="user-report-detail__content">
        <video
          className="user-report-detail__video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={policeVideo} type="video/mp4" />
        </video>

        <div className="user-report-detail__video-overlay"></div>
        <div className="user-report-detail__overlay">
          <UserReportCard report={report} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserReportDetail;
