import { useParams } from "react-router-dom";
import BookReader from "../Components/BookReader";

const ReaderPage = () => {
  const { id } = useParams();

  // TEMP static PDF (we'll make dynamic later)
  const pdfUrl = "http://localhost:5000/api/books/read/sample.pdf";

  const userEmail = localStorage.getItem("email");

  return <BookReader pdfUrl={pdfUrl} userEmail={userEmail} />;
};

export default ReaderPage;