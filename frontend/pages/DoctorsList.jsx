import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../pages/DoctorsList.module.css";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const query = `
        query GetAllDoctors {
          getAllDoctors {
            _id
            name
            specialization
            qualification
            experience
            email
            phone
            image
            description
          }
        }
      `;

      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const doctorsData = result.data.getAllDoctors;
      setDoctors(doctorsData);

      // Extract unique specializations from all doctors' specialization arrays
      const allSpecializations = doctorsData.flatMap(
        (doc) => doc.specialization
      );
      const uniqueSpecializations = [...new Set(allSpecializations)];
      setSpecializations(uniqueSpecializations);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSpecializationChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };

  // Filter doctors based on selected specialization
  const filteredDoctors = doctors.filter((doctor) => {
    if (!selectedSpecialization) return true;
    return doctor.specialization.some((spec) =>
      spec.toLowerCase().includes(selectedSpecialization.toLowerCase())
    );
  });

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.doctorsListContainer}>
      <h1>Our Eye Specialists</h1>

      <div className={styles.filterContainer}>
        <select
          value={selectedSpecialization}
          onChange={handleSpecializationChange}
          className={styles.specializationFilter}
        >
          <option value="">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className={styles.noResults}>
          No doctors found for the selected specialization.
        </div>
      ) : (
        <div className={styles.doctorsGrid}>
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className={styles.doctorCard}>
              <img
                src={
                  doctor.image ||
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABPlBMVEX////V1tv81GI6VWrr8PPh5un+cFj3vlY+a4LBwsU6aYDY2N3T1Nk5aICJxc3/12LKy8//bVTOz9Pg6u4zZX0yT2X29vfc3eEwUGr/2WLHzNPi4+bT2d/t7e/n7O/80lv9c1xGcYctS2IsTmr//PXs6OlkhJf8eGK/xs6lsr3mxWPiw2P+7sb/+u386cj5x1t1kaGcrrnm0c9UeY2Koa6xvMVrgI9Sanxrfo7Qt2TwzGNIXWplbmmNiWebkWf+9d90eGj94ZP95qf4w2Xt5dHx2a/3oZXpx8TxqJ75h3V3r7tujZ7bycrnq6RLZHd+jpytn2Z5fmfBrmVUZ2geSGuxoGWSi2eQmpyprqmsoXPGtHRbamn934j956v945v+67v82XPx1qXzzo31yHj5kIDxw770lodekKB7tL/gvb3rsLtgAAAUX0lEQVR4nNWdeWPTRhrGkWMTRUfjQ7ET2zmUgCMDBSuWCSQQoKU56oRAKOx2S4/dcpTv/wX2HZ1z6fBYwfLzBwUf0vw07zkauTdufAM1O5Z9+XD/1auFhYVX+/uPLi/tkdVdbzab3+Ls16zmerf/cGF7e3tlZSHUysrKNtKr/YeXTt9qbcwvabnbf7SyjbFR8lH3L0fduYQsW5cLCXg46fa+o816uJPLunyVCc/T9v5ozqaxMhEfmscFZ64QR68mwvM0T4jOtgDgwkp/1uPOqsojIcCFhf3urIeeTa1Hk3lgpO35sNOuMCBUPK1Zjz6DxGcQTaI96+GnqzwNIExi8c304VSAC9uFjzWXglE00MrlrAlSZE3HhxBnjZCs5nROiLRtzRoiUUK1GjWHD2cNkaTm5dRTCCryJHb3cwAsdOk2ygMQwmlhc2JTrKNgNZo1SZwqU2b7QCuPKrNGiVF3+kjqIxY12Fj5TCHyxPVZs/DVz8kNC9tElcWy4c7hKvNaQQubCl6yre788ssOO3RGq4ev777ZoV8taMLoYIFm5/njgztXR29TKFdX39wtLR88ZxD3C0nYitxw9enacqm0vLZ28Pr5YSzewuHTu+7nDp4z16GQoaYdER4elHwB5LunTw5htqjJWzh8cuTygZbvPqEAtwuZEUch4epRCdPy2sHVr0+f/3a4sLOzirSz8PbJm6OrA58PfeSKmunt9qxpOGraYaDZuSqRWl4r3X189e710funT98fvX539RjDc3VEERZxbbjphISrd5dLjJbBLUulg4OD0tryMv0+uCJJWMQ1N6w5POQRJmv5MUG4UnDCt3cnBQTEN3gsWnFmjcNRM+osntyZnLBU2pkfwlUhwrUjDLGYVjolYelO4WNpRPhciLD0NPLE7SK2+dMTPsYIi9hcRLFUlPDOkxCxkLcvMMI3B+k4HB0cRYRFrLyjmkaUcPkqiqaFJAzr0tWngoSPw/q7mP1h2FsIE94NHLGgPX7YH66+FyMs3Qk64UKmQ+jxQys9EiQ8CDJiIdtDbJ1mZ2rChWKuJlYeBYSvxQBLB+99woIu64frpeKEfkJcuSzPGoarZrDmvfNOkLDktxeFrEqRgvsWO1cTt/i+fvVTfjEDzY0bmh9qVkUJl197hI+KGWiwZf3HooTvVovshjdu3PqXR3goTHjlXaF/35o1Sozu/bowLaFbmL79z7NZo/B168XVW5fwN2HCx78hN35+8EcxJ/GZf4dl9fnky6W+vML0aK1UzEm8t7l25LWHYi0+EirbDq+WN+/NGoanWz9sen4k2jyB1pAnPzkobf5eRDO99WKzdPBkgb7zNJGWkSc/XSttFtIRb33YLK29R4SvRd0QKlPogSFObX4oKuHyXeSI78QJwZPfwn+KS1hagzl4K1yWooUMFElLmy8KSfjHprtcBslCGBAukbsCUlA//H0TjfDtzvspAOEaoT82f581DVf3EOHy1XPRigZTMfMh1DTu6Kax0VDFrGm+/5AHm6sP388ahisoanICLGZJA7qXE2CpdH/WKDH6/kU+k7j5ophGeiO/SSxmJEW69UcugIVM976efZjeTjc/FDNV+Hr2YnM6xs3NF4UGhGhz/8+/puD74d79wkaZUF59KqiipglS98WnsKC1DK3vhcNNQVsKVsJm+td8GCmYqWCsKXAtQ8nt9kX056xHnlmC1ducxBmkW2Kx5odZj3sC/Sk0h/MzhSCBdn9zfrwQ6Z6Amc56zBNqYk8s6PJavJ5NCvhi1iOeWH9ONol/Fbxn4miyRZvl+Qoznp79lR1x84cCL1zEK3tlMy9dE6PfMyPOWxwNdD/r/fwf56VronX/xweZAB/MMeFiFsQHi/NMmAHxweJ8E6YhAt8cEz5DhIuLqYCLf89fQeOp/NJDjJ1Gj2/xx5dF3U+aomY5QOQzPogAy4V8RCZVZdD9RV8PaMiAb3HxJ/TBWQ9WRE008PJPixFjQIn+Fr7sAZYrczeLzbY78PL6fxeT9d91j9Au4lOj8WqOelY5E6IPWC6PzEERnxuNUbdnjMuBbv8vAfB/t8PPjQ3TnhNT7Y4Nw6yUsyD+HQGWK6ZuDK05YNywDV1RrI1o6OWXf8cBvsQ+BXaqK4ZTzGe6MIGByrrpaBV87EFapPQjAbghjXq6bAwL7o1tEwbZG0lSp5yOeJ/4TEVqdQc6XJ6iPvTkamQqsjFutySpRYw+yvyYfiI/0oHLUnEURTELnDdcwEEFAGlCLPPHACJCmHlblxWzqA/n3bBkMFFnXZU4hGU6LYaJMFDL/VpzZCiKXNBZbMPYdLspuVJpQirzM4AeoSQ1LQVCaiF9sWsoumx3NG+gEg1ApkUs0wdSve9pHbB1xShgRC1DNjMdKRRDgCOSiZAghOnvA6JcvLzoGLLs1MNhShssQ5j5eYDl6OJojqkY41kD0RpBDBy0I0AeYZgWeYAb0VfVuiMresF+VqE7VJShhQFKFQ5F+WUsIE4oqe2eUrTM74AT9nFAPqGb+e9z36ngX1Yh2uiDIlXhlqnrAwKQKttC/cRkeh6hpKJLVpzE34R6UjHbJCGT8j2tv2QSoaeORH59CJNYkP+RV7MjQXg3bFXKQnj7E5sJXbXIr6t9A9l9Z/aMwCe1YQqHmpSF8PZx7ZiPSBFKEkyiAwedLWNzvYNmboRiOz1ApmxzdVq7WTvlvqPSB7ANLzqrnfVZQTYrLXdY9YGuj9v0HKq8hPhp6+bNm1ufOO9sMITQavrXTW3NZCK96UPnt6Bl6tezEN7eqgFhbZdjpyyhBhduUA+O1vnGP/61jkc+x9B7bZaQkxDPECAgnrFvVRhCdaTrRIBufStIcD4Jx6mDF9pqvU6PkE2Ixx4gIB6zhPTXwTaGujEiZlW6fpdsNtdbGjlbKooIoyyEF1s3A7Gu2KG/jkI0pETqNU1rrV/j/72Unj3PdqCEHGhSlSGk08XJWS0krJ2dUO8yyQJobKh1OS+DuV4PI0wfezookhXFhGyfSrj3MQIExI976YT9ITT7nHNK18PI5UNGqis9SFvVKjMKIpjePr5Jikz8GzzCUU8x+kwEChhz5mt24s6EjBTeYwnJYHpBAd6sEa7IhlIgXBow9Tx2+HxzZJM/gW7Ac42UQyh1sEk8oQFv1nBP3OBdwHrVAUeMOzNal8sPcJ2JLyGhbSrDNp8QN9PTGg143MHmmGekQNg3dSX21DDJuVlqPKCkDhRljIbHI6xsRHN0RiLWdk8alRBxo8InHA0VZRRnpjkirsefQmr3dNlR4wgrIUHlZJecw9NOpRJegQqfcMnq6TrdlZHKBXE94RQqXGV5FEOoBggAWOmcElN4tgdTiL3PO0d9CUpTJTbUeOfIATE2yLgnsE3ddG14iSWUOt4kIsBKY+8zZqdbFxVPG94UxhE6stJLOn8e4SYRUFIdRfeGwCNseQQ+zMluLZrCFkYIV4BTs7mEKI4lhJpcELnnDgWlo+G6YRxhxZ9CJMxOPzUqEWKF74aIcGQqppVopmApU05h4hVULag6vGC3tMR520WohArqttpZI3rRfT+GsI6ybVxVE0ibbhKTnQAFGsO7BjxC5IiYGnt+PK3tNSqk4gg1v55I1FQ/I5mQCV3Cvqybajxhi+RoXPgdMA3IDTSIEGpCLxklaaqsmHJwKLv1XnbCSsPL+7U96nW+syPCgRJfmUbDuLYplDQnKI01LqFEE3pdfu2EmkS+LwCh6sj6OA1wmklM9kIvlNpJhB2K0MuJtYvMhLas9/gtIi5hT2ymHBgLpTGEtCN60bR2ShHy7bAKhCPZ7T7TJBpOk3Ohv1bkXeEYQpUi9IJp7TNFyD88IrRktAiUSiiaE9OMFK6wboaEVWZBUaIdsbHF5sM4Qq26tFSX6rI+TEuIkrCZNtOOrI4MZVgPxwMjYiCpjOin/F2SkL2SWh0dr1qXVKh7UxMijETMTJOaCk99Qx8HK1DumJiJpBzRJ9xqJRECXjU4VGuYISEKtxhpbihptoEWErGReRceF4kSEJJFDXnU4FJ5V6inKxkIBR0xndAx3BtgJCNZghOEewHhpyRCZO7BUVW0GJUOeE2Ean2gGw5plRpNiNtj4yTon4iESJ8HP4TqGMqAWYrNiTC59QW565mOBn+LXoc5pBb9ccJPASGREOnzVJeq4TFUcIRxesoX6xLjCVWpbtk92TAUGf4wx3Z087DK9Ik44UVASCRE2s3qKE0Ep0LBLEPKz5dQtfowebquIOmKrhvyYOTdBsMHF5wbIzzlNYhMNsQtHSWkLEWNGCH/uGq73zOAy5CHPdBwKKMtifq4j3Z8MUZKEh6HhFieZN0dO4pqGXovQ1EjRBiTDkcDGfjkntMfjSzLGo1sp+e+4liqxhop7oiN8ObMGdY/saaCW0Lb0LOUbUIJkUuo9Ye6rIBVWijCeNKsvkvdG3GMVFKj6WqEy8K7WP/EqWjwaGpkKkzFCHmANtqpPh5BOYUfXqqP0Bb9oc2rvyMzbYSrwrtYQuQMHzdTI32lBikvQlsGB3Q4b6Dsj24kxqy40YRbWELkHAyzBVXW5W9HiPYp6WaMzbT6pq7LnDcjM+1Et7mjhMiL2KiOD749VJQMpbcYIbO7Apq1BLdX0TMv9O42lz2A2QsJa8eJhJiZqj0l5daFK6GFDIZQ6yHAhLPYaGsv+3pA2MAIP4cTG7PMFsQataczW+byIqQdxN0QaSecpb7kmDLntnSQLxonEeHHvURCiKa+marjGMenJLItnMrEaMlCTiyC4cL3FKXHdvoB4afQDWthQoxbhArnEN03SFnyQxIpvWlCR46NMr6qSyiZsDblm2kDu5d/FiTEmNXuyA+hffo2hGq7l3YvD4VAmETWE30zbWC3ZsKEGBdKw2zhAOE1tU8UIYQRJa0Eri/Z3JUjn/A4Igw7RP6NQ6z0hi57kKF9EiBsUoSOknazUkJ2OtQ56yqemTY+R4DBkimvy9aWsPo9M+HkpTdF2EYxLTVqa1W06sDuDPMIsV1RtdNOrJFW8eoWbZu7LkLi5O59tAx9mmZz+zmPEN/Y9rkVR0gu9XxLQt3IENKgY+WVPe6E4TtOgoTIXjPkhNiJrnEZgyKEqtNMPw9MInQ7bKhxJ6xFbE7ci3HDKtmBucsYnFLwGghl3k5IzplQt8O+7JalZ1gs9TpEbn+P26iK9kIM+1IqYi6EZlZCm81fbtGGbxracgkZN6wv4S2m2h5Auy1DAzXQUhi/nZWintxmO/0WTVhzUz49bI1Y6IFS3pA9GXI/OQqIEBJnzxxpLIg0fXY9SkVlKUF4wet+CRtFvQrAKbr7p2knbwuZmhDdDM2QLVCT3BvRC98SMtMGts87SIjUh8g4ip4MB7IvX75AtZt2HzEHwnGmPs1bha/ylk0pQpQQ6ZtOxPfQpkBZ//LzP9/98/MXNIuJaVGEkDp70n5dDGSsKI5K1F3+CIjC20+I1PHICzNyAb/z9AX+wVsiiTQ5IbVME+1gSyb07vfVGTtVo/VgTyghkh+hcv1AB8v8xyf8zoRok9hFTd7k04RoF2I6Ydv0Fv9YO21RhLt7dDZcIr8D10r/OQBEk5hc2wgQUveQIJgqqdUT2jvhPQ7M2Gmr85kgrJ00yAtGXxSTIPwZZrSXUNsILNTQhBBM9dTF52j/C2OnrdZHkvAT6YbMF4BQ+ZaEUr0HzXYqoSMrY+9D9JSoexThBWGkGnNTZzIrzYFQzbLFTB2HGwu0KhE3JOmc3MxeOyWMlHVc9Fs1w5AwLdLkQZi+IxktqUabQ2izO6fm8DN+udjgK41QxYZni8R1sDwI0Y7klCUh9/mScBzUtGgU4Rl2AtZG3VUFhIjyRYaML0B4mx492pGcEmrQb3ZE6/rY3Qek7jFFeB69x7sthx4vBjDTHJqmW5gm36DZmJiQad3a6ft1VcfEH+MhTa97QTxyUfuoxXwwVB/Vo6h38irvZBeZfLGNIcywXxct346xgZB2Soaa2mlIyASlEBHdXfbai9TdbTkQqumVqQbxlrgIhHt1PxJz+DXmQuCntJyeCbZq9pzUviYPQlSZpm/dJ641cb+6Szyht3vejT4UF8FU1erbtt231NSiPw/CftpuVrdNtuhKJRr9OdY+1T6GgSbORn1GV2l8AoTsbhq1Ladsi0Ch1GA6omj4XXyxLXTDOpsoRDTxgilnv5Aqp+z1hKqUeSISokg4iV3sKcTahW+kCTY6kSZeqOEQtlIrU9TgJ+zh6p5HhLtffULOFhwh5UGocu9JYGoPePc26pGddrcYN6zzN4hPrlwIsQV2ksP7F7Z1Hxdmp92wRawde9RaPk4oRMjZNmKhdTQVAVkWsXHWaiNIN5RyaseIovs1INzy3bCajxNKAktRvH17muFWpmrfGfecCKU96I0d93XZf9ySUj10tTBf+G5Yz8kJhQh5Bxmie+otx9RB0baTPtqqOLRb7u/UcG0unKmgv/DdMD8bzYkQYiUUUGO3FDaifScD3a2MBz14lXNTBikkCZ5e+9wlyPNQLoTtIdow691IiBrugfeKDu/FrTNovjV2z3E31PKzURFCnvlAtDSVGEKo/834/cp1f7b8Rt9zw1wBJ36UlP94rNq2BwP3fglmpeg3ISHGDAb9enw9UPWSouaWNbUzxFvNzwlFCOMePYQq2AZbVYhIA6bbs1uJ9bHmPbDf/epaKXJDLU8nzJFQQnnPGY+xXTxtZzywU/u3uvsUTPerW30jN+T8RsE0mnihJunxUVVrEz9eBv9Mvw3tE52jsmYL3LCe0DKJKFdCQXmTiPLFLrLaXG1UgJBeastjDGjWul933WyYN+DkhKmPdQmojuwU8gX0hvV8nRBp0ib/Ogi9iTuu1c413vOmU6oQhBLYafdia6vL/rrb9CoGoVZHjvixew2AExOm3+4VkqZJ2tlF/iYqTf608zURSmCmn8/TPyagSQkzrFAKqvvpWqYw9tcx/g8HJcwUrrAA8QAAAABJRU5ErkJggg=="
                }
                alt={doctor.name}
                className={styles.doctorImage}
              />
              <div className={styles.doctorInfo}>
                <h2>{doctor.name}</h2>
                <div className={styles.specializationTags}>
                  {doctor.specialization.map((spec, index) => (
                    <span
                      key={index}
                      className={`${styles.specializationTag} ${
                        selectedSpecialization &&
                        spec
                          .toLowerCase()
                          .includes(selectedSpecialization.toLowerCase())
                          ? styles.highlightedTag
                          : ""
                      }`}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
                <p className={styles.qualification}>
                  {doctor.qualification || "Not specified"}
                </p>
                <p className={styles.experience}>
                  Experience: {doctor.experience || "Not specified"}
                </p>
                <p className={styles.description}>
                  {doctor.description || "No description available"}
                </p>
                <div className={styles.contact}>
                  <p>Email: {doctor.email || "Not available"}</p>
                  <p>Phone: {doctor.phone || "Not available"}</p>
                </div>
                <Link
                  to={`/book-appointment/${doctor._id}`}
                  className={styles.bookButton}
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
