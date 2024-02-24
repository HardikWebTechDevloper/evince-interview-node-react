import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Modal } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from "react-data-table-component";

// CSS
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [intialValues, setIntialValues] = useState({
    name: '',
    email: '',
    employeeId: '',
    mobileNumber: '',
    gender: '',
    age: '',
    anotherPhoneNumber: ''
  });
  const [employeeId, setEmployeeId] = useState(null);

  // Datatable Configs
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortColumnName, setSortColumnName] = useState('');
  const [sortType, setSortType] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // Datatable Columns
  const columns = [
    {
      name: "Employee Id",
      selector: (row) => row.employeeId,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => row.id,
      cell: (row) => (
        <>
          <Button variant='info' onClick={() => handleOnEditEmployeeDetails(row)} >Edit</Button>
        </>
      ),
    },
  ];

  // Back-end API URL
  const API_URL = 'http://localhost:3300';

  // Modle hide and show handlers
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // API Request handler 
  const controller = new AbortController();

  useEffect(() => {
    fetchEmployeeData(currentPage, currentLimit, searchValue, sortColumnName, sortType);

    // Cleanup Function
    return () => {
      controller.abort();
    }
  }, [currentPage, currentLimit, sortType, sortColumnName, searchValue]);

  // Fetch all employees data and load it to datatable
  const fetchEmployeeData = async (pageNo, pageSize, searchValue = "", sortColumn = "", sortType = "") => {
    try {
      setLoading(true);

      axios.post(`${API_URL}/getAllEmployees`,
        { pageNo, pageSize, searchValue, sortColumn, sortType },
        { signal: controller.signal }
      ).then(response => {
        const data = response.data.data;

        if (data && data.employeesData && data.employeesData.length > 0) {
          setEmployees(data.employeesData);
          setTotalRows(data.total);
        } else {
          setEmployees([]);
          setTotalRows(0);
        }
      }).catch(error => {
        toast.error(error.message);
      })
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(`Request cancelled:: ${error.message}`);
        return;
      }

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle open model with employee details for update employee
  const handleOnEditEmployeeDetails = async (employee) => {
    setEmployeeId(employee.id);
    setIntialValues({
      name: employee.name,
      email: employee.email,
      employeeId: employee.employeeId,
      mobileNumber: employee.mobileNumber,
      gender: employee.gender,
      age: employee.age,
      phoneNumber: employee.phoneNumber
    });
    handleShow();
  }

  // Handle row per page change
  const handlePerRowsChange = (newPerPage, page) => {
    setCurrentLimit(newPerPage);
    setCurrentPage(page);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle Table Sorting
  const handleSort = async (column, sortDirection) => {
    setCurrentLimit(currentLimit);
    setCurrentPage(currentPage);

    let selector = (column && column.selector) ? column.selector.toString().split('.')[1] : 'id';
    setSortColumnName(selector);
    setSortType(sortDirection.toUpperCase());
  };

  // Text Filter
  const textFilter = (textValue) => {
    setSearchValue(textValue);
  }

  // Validation Schema for Add/Edit Employee
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(128, 'Name must be at most 128 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    employeeId: Yup.string()
      .matches(/^[a-zA-Z0-9]{10}$/, 'Employee ID must be alphanumeric and 10 characters long')
      .required('Employee ID is required'),
    mobileNumber: Yup.string()
      .matches(/^[6-9]\d{9}$/, 'Invalid Indian mobile number')
      .required('Mobile Number is required'),
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(['Male', 'Female', 'Other'], 'Invalid gender'),
    age: Yup.number()
      .required('Age is required')
      .min(18, 'Age must be at least 18')
      .max(60, 'Age must be at most 60'),
    phoneNumber: Yup.string()
      .matches(/^[6-9]\d{9}$/, 'Invalid indian phone number')
  });

  // Create and Update an employee handler
  const handleSubmitOfCreateEmployee = async (values, { setSubmitting }) => {
    try {
      if (employeeId) {
        const response = await axios.put(`${API_URL}/updateEmployee`, { ...values, id: employeeId });
        if (response && response.data) {
          handleClose();
          setEmployeeId(null);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${API_URL}/createEmployee`, values);
        if (response && response.data) {
          handleClose();
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong with save employee details");
    } finally {
      setSubmitting(false);
      fetchEmployeeData(currentPage, currentLimit, searchValue, sortColumnName, sortType);
    }
  };

  // Handle Open Create a Employee Modal
  const handleOpenCreateEmployeeModal = () => {
    setIntialValues({
      name: '',
      email: '',
      employeeId: '',
      mobileNumber: '',
      gender: '',
      age: '',
      anotherPhoneNumber: ''
    });
    setEmployeeId(null);
    handleShow();
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row align-items-center">
          <div className="col-10">
            <h1 className="text-left">Employees</h1>
          </div>
          <div className="col-2 text-right">
            <button className="btn btn-primary" onClick={handleOpenCreateEmployeeModal}>Add Employee</button>
          </div>
        </div>
        <div className="row mt-3">
          <div className='col-md-8 text-right mb-3'>&nbsp;</div>
          <div className='col-md-4 text-right mb-3'>
            <input type='text' placeholder='Search' className='form-control' onChange={(e) => textFilter(e.target.value)} />
          </div>

          <div className="col-12">
            {/* Datatable */}
            <DataTable
              columns={columns}
              data={employees}
              sortServer
              onSort={handleSort}
              persistTableHead
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
            />
          </div>
        </div>

        {/* Toaster Components */}
        <Toaster
          position="top-right"
        />
      </div>

      {/* Modal for adding employee */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={intialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmitOfCreateEmployee}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group mt-3">
                  <label htmlFor="name">Name*</label>
                  <Field type="text" name="name" className="form-control" />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="email">Email*</label>
                  <Field type="email" name="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="employeeId">Employee ID*</label>
                  <Field type="text" name="employeeId" className="form-control" />
                  <ErrorMessage name="employeeId" component="div" className="text-danger" />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="mobileNumber">Mobile Number*</label>
                  <Field type="text" name="mobileNumber" className="form-control" />
                  <ErrorMessage name="mobileNumber" component="div" className="text-danger" />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="gender">Gender*</label>
                  <Field as="select" name="gender" className="form-control">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="text-danger" />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="age">Age*</label>
                  <Field type="number" name="age" className="form-control" />
                  <ErrorMessage name="age" component="div" className="text-danger" />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <Field type="text" name="phoneNumber" className="form-control" />
                  <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
                </div>
                <div className='mt-3'>
                  <Button type="submit" className="primary" disabled={isSubmitting}>
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
