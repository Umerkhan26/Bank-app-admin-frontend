import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h2`
  margin: 0;
  color: black;
  font-size: 18px;
`;

export const UserCount = styled.span`
  color: #777;
  font-size: 14px;
`;

export const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
  margin-right: 10px;
`;

export const AddUserButton = styled.button`
  padding: 8px 10px;
  border: none;
  border-radius: 4px;
  background-color: #1a8797;
  color: white;
  cursor: pointer;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
`;

export const TableHeader = styled.th`
  background-color: #f9f8fa;
  color: black;
  padding: 10px;
  text-align: left;
  font-size: 0.725rem;
  font-weight: bold;
  border: 1px solid #ddd;
`;

export const TableRow = styled.tr`
  border: 1px solid #ddd; /* Add border to rows */

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const TableData = styled.td`
  padding: 10px;
  color: black;
  font-size: 12px;
  border: 1px solid #ddd; /* Add border to data cells */
`;

export const UserProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;
