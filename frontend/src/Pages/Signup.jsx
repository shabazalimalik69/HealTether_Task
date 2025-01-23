import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signupAPI } from "../Redux/User/userActions";
import { useNavigate } from "react-router-dom";

const Signup = ({ isOpen, setClose }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile:""
  });
  const toast = useToast();
  const dispatch = useDispatch();
  const { firstName,lastName,email,mobile, password } = user;
  const navigate = useNavigate();
  const onClose = () => {
    setClose(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(signupAPI(user));
    setClose(false);
    toast({
      title: "Account created.",
      description: "We've created your account for you.",
      status: "success",
      duration: 2000,
      position:"top",
      isClosable: true,
    });
    navigate("/signin");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                onChange={handleChange}
                value={firstName}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input
                onChange={handleChange}
                value={lastName}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                onChange={handleChange}
                value={email}
                name="email"
                type="text"
                placeholder="Email"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Mobile</FormLabel>
              <Input
                onChange={handleChange}
                value={mobile}
                name="mobile"
                type="text"
                placeholder="Mobile"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                onChange={handleChange}
                value={password}
                name="password"
                type="password"
                placeholder="Password"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleCreate} colorScheme="blue" mr={3}>
              Create Account
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Signup;
